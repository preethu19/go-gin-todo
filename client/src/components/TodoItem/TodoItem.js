
import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md'
import './todoItem.css'

const TodoItem = ({todos, onDelete, onComplete, onEdit}) => {
    return (  
       <div className='todoitem-list'>
           <div className='todoitem-check round'><input type="radio" checked={todos.completed} onChange={(e)=>onComplete(todos.id)} /></div>
           <div className='todoitem-title' style={{textDecoration: todos.completed? "line-through": 'none'}}>{todos.title}</div>
           <div className='todoitem-edit' onClick={(e)=>onEdit(todos.title, todos.id)}><MdEdit size={20} /></div>
           <div className='todoitem-delete' onClick={(e)=>onDelete(todos.id)}><MdDelete size={20} /></div>
       </div> 
    );
}

export default TodoItem;