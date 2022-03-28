package routes

import (
	"todo-backend/controllers"

	"github.com/gin-gonic/gin"
)

func TodoRoute(router *gin.Engine) {
	router.GET("/", controllers.GetTodos())
	router.POST("/", controllers.CreateTodo())
	router.PUT("/:todoId", controllers.UpdateTodo())
	router.PUT("/:todoId/complete", controllers.CompleteTodo())
	router.DELETE("/:todoId", controllers.DeleteTodo())
}
