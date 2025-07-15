import React from 'react';
import { Briefcase, Dumbbell, BookOpen, Coffee, Heart, Home, Car, ShoppingCart, Users, Music } from 'lucide-react';

const taskIcons = {
  work: { icon: Briefcase, color: 'blue' },
  exercise: { icon: Dumbbell, color: 'green' },
  study: { icon: BookOpen, color: 'purple' },
  coffee: { icon: Coffee, color: 'amber' },
  health: { icon: Heart, color: 'red' },
  home: { icon: Home, color: 'gray' },
  travel: { icon: Car, color: 'indigo' },
  shopping: { icon: ShoppingCart, color: 'pink' },
  social: { icon: Users, color: 'orange' },
  music: { icon: Music, color: 'teal' }
};

const TaskModal = ({ showDate, selectedTaskType, setSelectedTaskType, addTask, onClose }) => {
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addTask(showDate, selectedTaskType, e.target.value.trim());
              }
            }}
          />
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button
            onClick={() => {
              const input = document.querySelector('.task-input');
              if (input.value.trim()) {
                addTask(showDate, selectedTaskType, input.value.trim());
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
