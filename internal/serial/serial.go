package serial

import (
	"DoseMqtt/data"
	"DoseMqtt/internal/config"
	"DoseMqtt/internal/datalog"
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
						tm, _ := time.Parse("2006-01-02 15:04:05", dat.TimeStamp)
						datalog.LogDataChan <- datalog.LogData{
							TimeStamp:       tm,
							CurrentDoseRate: dat.CurrentDoseRate,
							AverageDoseRate: dat.AverageDoseRate,
							CPM:             dat.CPM,
						}
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

/*

Version 1.62a, Release Date:Dec.17,2020
UUID:39330851313738380030002C
2020-12-26 17:10:46
RealTime DoseRate: 0.152 uSv/h
Average DoseRate: 0.131 uSv/h
CPM(Counts Per Minute): 30
Battery:0.00 V
============
*/
func ParseDoseData(strs []string) (*data.MqttData, error) {
	dat := data.MqttData{
		Longitude: config.C.General.Longitude,
		Latitude:  config.C.General.Latitude,
	}

	if len(strs) < 9 {
		return nil, errors.New("check data integrity err")
	} else {
		if strings.Contains(strs[1], "HW Version") == false {
			return nil, errors.New("check data integrity err")
		}
		//parse data
		dat.Version = strs[1]
		if config.C.General.DeviceUuid == "" {
			dat.UUID = strings.Split(strs[2], ":")[1]
		} else {
			dat.UUID = config.C.General.DeviceUuid
		}
		dat.TimeStamp = strs[3]
		dat.CurrentDoseRate, _ = strconv.ParseFloat(strings.Split(strs[4], " ")[2], 64)
		dat.AverageDoseRate, _ = strconv.ParseFloat(strings.Split(strs[5], " ")[2], 64)
		dat.CPM, _ = strconv.Atoi(strings.Split(strs[6], " ")[3])
		dat.Battery, _ = strconv.ParseFloat(strings.Split(strs[7], ":")[1], 64)
		data.CurrentDoseData = dat
	}
	return &dat, nil
}
