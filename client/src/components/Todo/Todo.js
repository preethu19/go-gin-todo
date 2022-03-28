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

    useEffect(()=>{
        fetchData();
    }, [])

    const onComplete = async (id) => {
        
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/${id}/complete`);
            let updatedTodos = todoItems.map((todo)=> {
                if(todo.id === id){
                    todo.completed = true
                }
                return todo
            })
            if(res.data.message=="success"){
                setTodoItems(updatedTodos)
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
            const newList = [...todoItems].filter((todo)=> todo.id!==id);
            if(res.data.message=="success"){
                setTodoItems(newList)
                toast.error("task deleted")
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

    const onSubmit = async(titlePresent, todoId) =>{
        if(titlePresent!=""){
            try{
                let res;
                if (!edit){
                    res = await axios.post(`${process.env.REACT_APP_API_URL}/`, {"title": titlePresent});
                    toast.success("task added")
                }else{
                    res = await axios.put(`${process.env.REACT_APP_API_URL}/${id}`, {"title": titlePresent});
                    toast.success("task updated")
                }
                console.log(res)
                if (res.data.message=="success"){
                    setTitle("")
                    if(!edit){
                        const newList = [res.data.data.data, ...todoItems]
                        setTodoItems(newList)
                    }
                    else{
                        let updatedTodos = todoItems.map((todo)=> {
                            if(todo.id === todoId){
                                todo.title = titlePresent
                            }
                            return todo
                        })
                        setTodoItems(updatedTodos)
                    }
                }
                else{
                    toast.error("error in update")
                }
                
            }
            catch(err){
                console.log(err)
                toast.error("server error")
            }
        }
        else{
            toast.error("Title is empty")
        }
    }
    
    return (  
        <div className="todo-container">
                <h1 className='todo-title'>Todo App</h1>
                <TodoForm data={title} edit={edit} id={id} onSubmit={onSubmit} />
                { !loading? renderTodos(): null }
        </div>
    );
}

export default Todo;