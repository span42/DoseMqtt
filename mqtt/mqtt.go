package mqtt

import (
	"DoseMqtt/data"
	"DoseMqtt/internal/config"
	"encoding/json"
	"fmt"
	"time"

	paho "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"
)

var conn paho.Client

func Setup(conf config.Config) error {
	NewMqtt()
	go func() {
		for dat := range data.DoseDataChan {
			if str, err := json.Marshal(dat); err == nil {
				topic := fmt.Sprintf("Amobbs/DoseDevice/%s/up/data", dat.UUID)
				PublishData(topic, string(str))
			} else {
				log.Println(err.Error())
			}
			log.Println(dat)
		}
	}()

	return nil
}

func NewMqtt() *paho.Client {
	opts := paho.NewClientOptions()
	opts.AddBroker(config.C.General.MqttServer)
	//opts.SetUsername("")
	//opts.SetPassword("")
	opts.SetCleanSession(true)
	opts.SetClientID("")
	opts.SetOnConnectHandler(onConnected)
	opts.SetConnectionLostHandler(onConnectionLost)
	opts.SetMaxReconnectInterval(5 * time.Second)

	conn = paho.NewClient(opts)
	go func() {
		for {
			if token := conn.Connect(); token.Wait() && token.Error() != nil {
				log.Debugf("gateway/mqtt: connecting to mqtt broker failed, will retry in 2s: %s", token.Error())
				time.Sleep(2 * time.Second)
			} else {
				break
			}
		}
	}()

	return &conn
}

func onConnected(c paho.Client) {
	log.Info("gateway: connected to mqtt server")
}
func onConnectionLost(c paho.Client, reason error) {
	log.Errorf("gateway/mqtt: mqtt connection error: %s", reason)
}

func PublishProfile(topic string, message string) {
	if token := conn.Publish(topic, 2, true, message); token.Wait() && token.Error() != nil {
		log.WithError(token.Error()).WithFields(log.Fields{
			"topic": topic,
			"qos":   2,
		}).Errorf("gateway/mqtt: publish profile error")
	}
}

func PublishData(topic string, message string) {
	if token := conn.Publish(topic, 0, false, message); token.Wait() && token.Error() != nil {
		log.WithError(token.Error()).WithFields(log.Fields{
			"topic": topic,
			"qos":   2,
		}).Errorf("gateway/mqtt: publish Data error")
	}
}
