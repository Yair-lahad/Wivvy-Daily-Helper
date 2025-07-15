import React, { useState } from 'react';

const TodoList = ({ todos, onToggle, onDelete, onAdd }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="todo-list">
      <h3>Genaral To-Do List</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new task..."
        />
      </form>
      <ul>
        {todos.length === 0 && <li className="empty">No to-dos</li>}
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
