package tests

import (
	"todo-backend/routes"

	"github.com/gin-gonic/gin"
)

func init() {
	routerTest := gin.Default()
	routes.TodoRoute(routerTest)
}
