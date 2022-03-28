import React from 'react';
import './App.css';
import Header from './components/Header/Header.js';
import Todo from './components/Todo/Todo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Header />
      <Todo />
      <ToastContainer />
    </>
  );
}

export default App;
