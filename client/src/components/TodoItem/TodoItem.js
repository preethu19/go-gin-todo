import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md'
import './todoItem.css'

const TodoItem = ({todos, onDelete, onComplete, onEdit}) => {
    const [isCompleted, setIsCompleted] = useState(false);
    useEffect(()=>{
        setIsCompleted(todos.completed)
    }, [])
    return (  
       <div className='todoitem-list'>
           <div className='todoitem-check round'><input type="radio" checked={isCompleted} onChange={(e)=>{setIsCompleted(true);onComplete(todos.id)}} /></div>
           <div className='todoitem-title' style={{textDecoration: isCompleted? "line-through": 'none'}}>{todos.title}</div>
           <div className='todoitem-edit' onClick={(e)=>onEdit(todos.title, todos.id)}><MdEdit size={20} /></div>
           <div className='todoitem-delete' onClick={(e)=>onDelete(todos.id)}><MdDelete size={20} /></div>
       </div> 
    );
}

export default TodoItem;