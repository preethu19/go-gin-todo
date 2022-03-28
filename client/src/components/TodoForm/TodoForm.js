import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import './todoForm.css';
import { toast } from 'react-toastify';

const TodoForm = ({data, edit, id, onSubmit}) => {
    const [titlePresent, setTitlePresent] = useState("");
    useEffect(() => {
      setTitlePresent(data)
    }, [data, onSubmit])
    

    
    return ( 
        <div className="todo-input">
            <div>
                <input className='todo-input-field' type="text" placeholder="Add a todo" name="todoInput" onChange={(e)=>setTitlePresent(e.target.value)} value={titlePresent} />
            </div>
            <div>
                <AiOutlinePlus className='todo-input-button' size={28} strokeWidth={20} onClick={(e)=>onSubmit(titlePresent, id)} />
            </div>
        </div>
     );
}

export default TodoForm;