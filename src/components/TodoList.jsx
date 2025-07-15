import React from 'react';
import '../App.css'; // optional if you want to style separately

const TodoList = ({ tasks, toggleTask }) => {
  const flatTasks = Object.entries(tasks).flatMap(([date, dayTasks]) =>
    dayTasks.map(task => ({ ...task, date }))
  );

  return (
    <div className="todo-list">
      <h3>To-Do</h3>
      <ul>
        {flatTasks.length === 0 && <li className="empty">No tasks yet.</li>}
        {flatTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.date, task.id)}
            />
            <span>{task.title}</span>
            <small>{task.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
