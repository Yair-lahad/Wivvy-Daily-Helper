// src/components/CurrentDayView.jsx
import React from 'react';
import { taskIcons } from '../assets/consts';

const CurrentDayView = ({ date, tasks, onToggle, onDelete }) => {
  const dateStr = date.toDateString();
  return (
    <div className="current-day-view">
      <h3> {dateStr}</h3>
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {tasks.map(task => {
            const Icon = taskIcons[task.type]?.icon;
            return (
              <li key={task.id} className="task-item">
                <span className={`icon ${taskIcons[task.type].color}`}>
                  {Icon && <Icon size={16} />}
                </span>
                <span className={task.completed ? 'done' : ''}>{task.title}</span>
                <button onClick={() => onToggle(task.id)}>✓</button>
                <button onClick={() => onDelete(task.id)}>✕</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CurrentDayView;
