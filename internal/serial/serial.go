package serial

import (
	"DoseMqtt/data"
	"DoseMqtt/internal/config"
	"errors"
	"io"
	"strconv"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tarm/serial"
)

func Setup(conf config.Config) error {

	c := &serial.Config{Name: config.C.General.SerialPort, Baud: 115200, ReadTimeout: time.Second * 2}
	fd, err := serial.OpenPort(c)
	if err != nil {
		log.Println(err)
		return nil
	}
	go func() {
		buf := make([]byte, 128)
		str := ""
		for {
			n, err := fd.Read(buf)
			if err != nil {
				if err != io.EOF {
					log.Println("Error reading from serial port: ", err)
					continue
				}
			}
			if n != 0 {
				str += string(buf[:n])
			} else { //timeout
				if len(str) > 0 {
					strs := strings.Split(str, "\r\n")
					dat, err := ParseDoseData(strs)
					if err == nil {
						data.DoseDataChan <- *dat
					} else {
						log.Println(err)
					}
				}
				str = ""
			}
		}
		defer fd.Close()
	}()

	return nil
}

func ParseDoseData(strs []string) (*data.MqttData, error) {
	dat := data.MqttData{
		Longitude: config.C.General.Longitude,
		Latitude:  config.C.General.Latitude,
	}
	if len(strs) != 8 {
		return nil, errors.New("check data integrity err")
	} else {
		//parse data
		dat.Version = strs[1]
		dat.UUID = "00000000000000000000" //strings.Split(strs[2], ":")[1]
		dat.TimeStamp = strs[3]
		dat.CurrentDoseRate, _ = strconv.ParseFloat(strings.Split(strs[4], " ")[2], 64)
		dat.AverageDoseRate, _ = strconv.ParseFloat(strings.Split(strs[5], " ")[2], 64)
		dat.CPM, _ = strconv.Atoi(strings.Split(strs[6], " ")[1])

		data.CurrentDoseData = dat
	}
	return &dat, nil
}
