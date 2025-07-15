import React, { useRef } from 'react';
import { taskIcons } from '../assets/consts';


const TaskModal = ({ selectedDate, selectedTaskType, setSelectedTaskType, addTask, onClose }) => {
  const inputRef = useRef();
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Task</h3>

        <div className="form-group">
          <label>Choose an icon</label>
          <div className="icon-grid">
            {Object.entries(taskIcons).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedTaskType(type)}
                  className={`icon-button ${selectedTaskType === type ? 'selected' : ''} ${config.color}`}
                >
                  <IconComponent size={24} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Task title</label>
          <input
            type="text"
            placeholder="Enter task description"
            className="task-input"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputRef.current?.value.trim()) {
                addTask(selectedDate, selectedTaskType, inputRef.current.value.trim());
                inputRef.current.value = '';
                onClose();
              }
            }}
          />

        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button
            onClick={() => {
              const value = inputRef.current?.value.trim();
              if (value) {
                addTask(selectedDate, selectedTaskType, value);
                inputRef.current.value = '';
                onClose();
              }
            }}
            className="add-button"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
