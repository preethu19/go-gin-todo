package main

import (
	"fmt"
	"todo-backend/configs"
	"todo-backend/routes"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	port := configs.EnvPORT()

	if port == "" {
		port = "8000"
	}

	router := gin.Default()

	router.Use(CORSMiddleware())
	//run database
	configs.ConnectDB()

	// routes
	routes.TodoRoute(router)

	router.Run(fmt.Sprintf(":%s", port))
}
