import React, { useEffect, useState } from 'react';
import TodoForm from '../TodoForm/TodoForm';
import TodoItem from '../TodoItem/TodoItem';
import './todo.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Todo = () => {
    const [todoItems, setTodoItems] = useState([]);
    const [title, setTitle] = useState("");
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/`);
                setTodoItems(res.data.data.data);
                setLoading(false)
            }
            catch(err){
                console.log(err)
                toast.error("server error")
            }
        }
        fetchData();
    }, [])

    const onComplete = async (id) => {
        
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/${id}/complete`);
            if(res.data.message=="success"){
                toast.info("task completed")
            }
            else{
                toast.error("Error in update")
            }
        }
        catch(err){
            console.log(err)
            toast.error("server error")
        }
    }

    const onDelete = async (id) => {
        try{
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/${id}`);
            if(res.data.message=="success"){
                toast.error("task deleted")
                window.location.reload(0);
            }
            else{
                toast.error("error in delete")
            }
            
        }
        catch(err){
            console.log(err);
            toast.error("server error")
        }
    }

    const onEdit = (newTitle, newId) => {
        setTitle(newTitle)
        setEdit(true)
        setId(newId);
    }

    const renderTodos = () => {
        if(todoItems && todoItems.length){
            return(
                todoItems.map((value, key)=>{
                    return(
                    <TodoItem key={value.id} todos={value} onDelete={onDelete} onComplete={onComplete} onEdit={onEdit} />
                    )   
                })
            )
        }
        else{
            return(
                <div className='empty-task'>
                    <b>No tasks available</b>
                </div>
                
            )
        }
        
    }
    
    return (  
        <div className="todo-container">
                <h1 className='todo-title'>Todo App</h1>
                <TodoForm data={title} edit={edit} id={id}/>
                { !loading? renderTodos(): null }
        </div>
    );
}

export default Todo;