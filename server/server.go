package main

import (
	"todo-backend/configs"
	"todo-backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	//run database
	configs.ConnectDB()

	// routes
	routes.TodoRoute(router)

	router.Run("localhost:6000")
}
