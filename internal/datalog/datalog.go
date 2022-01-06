package datalog

import (
	"DoseMqtt/internal/config"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type LogData struct {
	TimeStamp       time.Time `gorm:"primary_key;not null" json:"timeStamp"`
	CurrentDoseRate float64   `json:"currentDoseRate"`
	AverageDoseRate float64   `json:"averageDoseRate"`
	CPM             int       `json:"cpm"`
}

var LogDataChan chan LogData
var db *gorm.DB

func init() {
	LogDataChan = make(chan LogData, 10)
}

func Setup(conf config.Config) error {
	var err error
	db, err = gorm.Open(sqlite.Open(config.ExePath+"/datalog.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.Debug()
	// Migrate the schema
	db.AutoMigrate(&LogData{})

	go func() {
		for dat := range LogDataChan {
			if conf.General.IsLog == false {
				continue
			}
			db.Model(LogData{}).Create(dat)
			db.Table("log_data").Delete(&LogData{}, "time_stamp < date('now','start of day','-365 day')")
		}
	}()
	return nil
}

func GetHistoryData(start string, stop string) (dat []LogData) {
	db.Table("log_data").Where("time_stamp>=? AND time_stamp <=?", start, stop).Find(&dat)
	return dat
}
