package gin

import (
	. "DoseMqtt/data"
	"DoseMqtt/internal/config"

	//"html/template"
	//"io/ioutil"
	"net/http"
	//"strings"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func Setup(conf config.Config) error {
	go func() {
		GinHanlder()
	}()
	return nil
}

// func loadTemplate() (*template.Template, error) {
// 	t := template.New("")
// 	for name, file := range Assets.Files {
// 		if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
// 			continue
// 		}
// 		h, err := ioutil.ReadAll(file)
// 		if err != nil {
// 			return nil, err
// 		}
// 		t, err = t.New(name).Parse(string(h))
// 		if err != nil {
// 			return nil, err
// 		}
// 	}
// 	return t, nil
// }

func GetApiHtml(c *gin.Context) {

	c.HTML(http.StatusOK, "info.tmpl", gin.H{
		"title": "Dose WebPage",
	})
}

func GetDoseData(c *gin.Context) {
	c.JSON(http.StatusOK, CurrentDoseData)
}

func GinHanlder() {

	gin.SetMode("release") //release/debug
	route := gin.Default()
	// t, err := loadTemplate()
	// if err != nil {
	// 	panic(err)
	// }
	//route.SetHTMLTemplate(t)
	route.LoadHTMLGlob(config.ExePath + "/views/*.tmpl")
	route.Static("/static", config.ExePath+"/views/static")
	route.GET("/", GetApiHtml)
	route.GET("/currtenData", GetDoseData)
	log.Println("DoseServer is running on 'http://127.0.0.1:" + config.C.General.HttpPort + "'")
	route.Run(":" + config.C.General.HttpPort)
}
