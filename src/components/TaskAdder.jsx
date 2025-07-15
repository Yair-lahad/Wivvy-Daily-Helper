import React, { useState } from 'react';
import { taskIcons } from '../assets/consts';

const TaskAdder = ({ onAddTask, defaultType = 'Work', dateSpecific = false }) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState(defaultType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(selectedType, title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-adder">
      <input
        className="task-input"
        type="text"
        placeholder={`Add ${dateSpecific ? 'daily' : 'general'} task...`}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="icon-grid">
        {Object.entries(taskIcons).map(([type, { icon: Icon, color }]) => (
          <button
            key={type}
            type="button"
            className={`icon-button ${selectedType === type ? 'selected' : ''} ${color}`}
            onClick={() => setSelectedType(type)}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <div className="modal-buttons">
        <button className="add-button" type="submit">Add</button>
      </div>
    </form>
  );
};

export default TaskAdder;
