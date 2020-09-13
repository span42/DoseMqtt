package data

type MqttData struct {
	Version         string  `json:"version"`
	UUID            string  `json:"uuid"`
	CurrentDoseRate float64 `json:"currentDoseRate"`
	AverageDoseRate float64 `json:"averageDoseRate"`
	CPM             int     `json:"cpm"`
	Longitude       float64 `json:"longitude"`
	Latitude        float64 `json:"latitude"`
	TimeStamp       string  `json:"timestamp"`
}

var DoseDataChan chan MqttData

var CurrentDoseData MqttData

func init() {
	DoseDataChan = make(chan MqttData, 10)
}
