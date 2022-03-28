package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Todo struct {
	Id        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title     string             `json:"title,omitempty"`
	Completed bool               `json:"completed"`
	CreatedAt time.Time          `json:"createdAt,omitempty"`
}
