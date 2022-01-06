package config

var ExePath string

// C holds the global configuration.
var C Config

// Config defines the configuration structure.
type Config struct {
	General struct {
		LogLevel      int     `mapstructure:"log_level"`
		TimeFormat    string  `mapstructure:"time_format"`
		SerialPort    string  `mapstructure:"serial_port"`
		MqttServer    string  `mapstructure:"mqtt_server"`
		MqttUsername  string  `mapstructure:"mqtt_username"`
		MqttPassword  string  `mapstructure:"mqtt_password"`
		ForumUsername string  `mapstructure:"forum_username"`
		DeviceUuid    string  `mapstructure:"device_uuid"`
		Longitude     float64 `mapstructure:"longitude"`
		Latitude      float64 `mapstructure:"latitude"`
		IsLog         bool    `mapstructure:"is_log"`
		HttpPort      string  `mapstructure:"http_port"`
	}
}
