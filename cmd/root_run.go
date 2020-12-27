package cmd

import (
	"DoseMqtt/internal/config"
	"DoseMqtt/internal/datalog"
	"DoseMqtt/internal/gin"
	"DoseMqtt/internal/serial"
	"fmt"
	"os"
	"os/signal"
	"runtime"
	"strings"
	"syscall"

	"DoseMqtt/mqtt"

	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

func run(cmd *cobra.Command, args []string) error {
	// var gwStats = new(gateway.StatsHandler)
	tasks := []func() error{
		setLogLevel,
		startDatalog,
		startSerialAccept,
		startMqttClient,
		startGinServer,
	}

	for _, t := range tasks {

		if err := t(); err != nil {
			log.Fatal(err)
		}
	}

	sigChan := make(chan os.Signal)
	exitChan := make(chan struct{})
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	log.WithField("signal", <-sigChan).Info("signal received")
	go func() {
		log.Warning("stopping DoseMqtt")
		exitChan <- struct{}{}
	}()
	select {
	case <-exitChan:
	case s := <-sigChan:
		log.WithField("signal", s).Info("signal received, stopping immediately")
	}

	return nil
}

func setupMetrics() error {
	// setup aggregation intervals
	return nil
}

type contextHook struct {
	Field  string
	Skip   int
	levels []log.Level
}

func NewContextHook(levels ...log.Level) log.Hook {
	hook := contextHook{
		Field:  "line",
		Skip:   5,
		levels: levels,
	}
	if len(hook.levels) == 0 {
		hook.levels = log.AllLevels
	}
	return &hook
}

// Levels implement levels
func (hook contextHook) Levels() []log.Level {
	return log.AllLevels
}

// Fire implement fire
func (hook contextHook) Fire(entry *log.Entry) error {
	entry.Data[hook.Field] = findCaller(hook.Skip)
	return nil
}
func findCaller(skip int) string {
	file := ""
	line := 0
	for i := 0; i < 10; i++ {
		file, line = getCaller(skip + i)
		if !strings.HasPrefix(file, "logrus") {
			break
		}
	}
	return fmt.Sprintf("%s:%d", file, line)
}
func getCaller(skip int) (string, int) {
	_, file, line, ok := runtime.Caller(skip)
	if !ok {
		return "", 0
	}
	n := 0
	for i := len(file) - 1; i > 0; i-- {
		if file[i] == '/' {
			n++
			if n >= 2 {
				file = file[i+1:]
				break
			}
		}
	}
	return file, line
}
func setLogLevel() error {
	log.SetLevel(log.Level(uint8(config.C.General.LogLevel)))
	log.SetFormatter(&log.TextFormatter{
		//	DisableColors: true,
		//FullTimestamp:   false,
		TimestampFormat: "2006-01-02 15:04:05",
	})
	log.AddHook(NewContextHook())
	return nil
}

func startDatalog() error {
	if err := datalog.Setup(config.C); err != nil {
		return errors.Wrap(err, "setup datalog server error")
	}
	return nil
}
func startSerialAccept() error {
	if err := serial.Setup(config.C); err != nil {
		return errors.Wrap(err, "setup serial accept server error")
	}
	return nil
}

func startMqttClient() error {
	if err := mqtt.Setup(config.C); err != nil {
		return errors.Wrap(err, "setup mqtt client error")
	}
	return nil
}

func startGinServer() error {
	if err := gin.Setup(config.C); err != nil {
		return errors.Wrap(err, "setup ginServer error")
	}
	return nil
}
