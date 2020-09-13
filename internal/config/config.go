package config

var ExePath string

// C holds the global configuration.
var C Config

// Config defines the configuration structure.
type Config struct {
	General struct {
		LogLevel   int     `mapstructure:"log_level"`
		TimeFormat string  `mapstructure:"time_format"`
		SerialPort string  `mapstructure:"serial_port"`
		MqttServer string  `mapstructure:"mqtt_server"`
		Longitude  float64 `mapstructure:"longitude"`
		Latitude   float64 `mapstructure:"latitude"`
		HttpPort   string  `mapstructure:"http_port"`
	}
}
