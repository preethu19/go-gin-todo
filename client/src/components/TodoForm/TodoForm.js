import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import './todoForm.css';
import { toast } from 'react-toastify';

const TodoForm = ({data, edit, id}) => {
    const [titlePresent, setTitlePresent] = useState("");
    useEffect(() => {
      setTitlePresent(data)
    }, [data])
    

    const submitTodo = async() =>{
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
                    window.location.reload(0);
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
        <div className="todo-input">
            <div>
                <input className='todo-input-field' type="text" placeholder="Add a todo" name="todoInput" onChange={(e)=>setTitlePresent(e.target.value)} value={titlePresent} />
            </div>
            <div>
                <AiOutlinePlus className='todo-input-button' size={28} strokeWidth={20} onClick={submitTodo} />
            </div>
        </div>
     );
}

export default TodoForm;