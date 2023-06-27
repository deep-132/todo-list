import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './todolist.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
            title: newTodo,
            completed: false,
          });
          setTodos([...todos, response.data]);
          setNewTodo('');
      
          toast.success('Todo added successfully!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
          });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        completed: true,
      });
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: response.data.completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
        const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
        if (confirmDelete) {
          await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
        }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="container">
      <h1>TODO LIST</h1>
      <div className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
          <span className="todo-title">{todo.title}</span>
          <button className="complete-button" onClick={() => updateTodo(todo.id)}>
            {todo.completed ? (
              <FontAwesomeIcon icon={faCheckCircle} className="completed-icon" />
            ) : (
              'Complete'
            )}
          </button>
          <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default TodoList;
