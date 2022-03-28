package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"todo-backend/configs"
	"todo-backend/models"
	"todo-backend/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var todoCollection *mongo.Collection = configs.GetCollection(configs.DB, "todos")

func CreateTodo() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var todo models.Todo
		defer cancel()

		//validate the request body
		if err := c.BindJSON(&todo); err != nil {
			c.JSON(http.StatusBadRequest, responses.Response{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		newTodo := models.Todo{
			Id:        primitive.NewObjectID(),
			Title:     todo.Title,
			Completed: false,
			CreatedAt: time.Now(),
		}

		result, err := todoCollection.InsertOne(ctx, newTodo)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		c.JSON(http.StatusCreated, responses.Response{Status: http.StatusCreated, Message: "success", Data: map[string]interface{}{"data": result}})
	}
}

func GetTodos() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var todos []models.Todo
		defer cancel()

		findOptions := options.Find()
		findOptions.SetSort(bson.D{{Key: "createdat", Value: 1}})
		results, err := todoCollection.Find(ctx, bson.D{}, findOptions)

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		//reading from the db in an optimal way
		defer results.Close(ctx)
		for results.Next(ctx) {
			var singleTodo models.Todo
			if err = results.Decode(&singleTodo); err != nil {
				c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			}

			todos = append(todos, singleTodo)
		}

		c.JSON(http.StatusOK,
			responses.Response{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": todos}},
		)
	}

}

func UpdateTodo() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		todoId := c.Param("todoId")
		var todo models.Todo
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(todoId)

		//validate the request body
		if err := c.BindJSON(&todo); err != nil {
			c.JSON(http.StatusBadRequest, responses.Response{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		update := bson.M{"title": todo.Title}
		result, err := todoCollection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{"$set": update})

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		//get updated user details
		var updatedTodo models.Todo
		if result.MatchedCount == 1 {
			err := todoCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&updatedTodo)
			if err != nil {
				c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
				return
			}
		}

		c.JSON(http.StatusOK, responses.Response{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": updatedTodo}})
	}
}

func CompleteTodo() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		todoId := c.Param("todoId")
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(todoId)

		update := bson.M{"completed": true}
		result, err := todoCollection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{"$set": update})

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		//get updated user details
		var updatedTodo models.Todo
		if result.MatchedCount == 1 {
			err := todoCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&updatedTodo)
			if err != nil {
				c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
				return
			}
		}

		c.JSON(http.StatusOK, responses.Response{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": updatedTodo}})
	}
}

func DeleteTodo() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		todoId := c.Param("todoId")
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(todoId)
		fmt.Println(objId)
		result, err := todoCollection.DeleteOne(ctx, bson.M{"_id": objId})

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.Response{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		if result.DeletedCount < 1 {
			c.JSON(http.StatusNotFound,
				responses.Response{Status: http.StatusNotFound, Message: "error", Data: map[string]interface{}{"data": "Todo with specified ID not found!"}},
			)
			return
		}

		c.JSON(http.StatusOK,
			responses.Response{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": "Todo successfully deleted!"}},
		)
	}
}
