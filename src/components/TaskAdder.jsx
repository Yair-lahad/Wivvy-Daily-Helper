import React, { useState } from 'react';
import {
  Briefcase, Dumbbell, BookOpen, Coffee, Heart,
  Home, Car, ShoppingCart, Users, Music
} from 'lucide-react';

const taskIcons = {
  work: { icon: Briefcase, color: 'blue', label: 'Work' },
  exercise: { icon: Dumbbell, color: 'green', label: 'Exercise' },
  study: { icon: BookOpen, color: 'purple', label: 'Study' },
  coffee: { icon: Coffee, color: 'amber', label: 'Coffee' },
  health: { icon: Heart, color: 'red', label: 'Health' },
  home: { icon: Home, color: 'gray', label: 'Home' },
  travel: { icon: Car, color: 'indigo', label: 'Travel' },
  shopping: { icon: ShoppingCart, color: 'pink', label: 'Shopping' },
  social: { icon: Users, color: 'orange', label: 'Social' },
  music: { icon: Music, color: 'teal', label: 'Music' }
};

const TaskAdder = ({ onAddTask }) => {
  const [selectedTaskType, setSelectedTaskType] = useState('work');
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAddTask({
        id: Date.now(),
        type: selectedTaskType,
        title: title.trim()
      });
      setTitle('');
    }
  };

  return (
    <div className="task-adder">
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
          className="task-input"
          placeholder="e.g. Yoga, Work Report..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
      </div>

      <div className="modal-buttons">
        <button className="add-button" onClick={handleAdd}>Add to Pool</button>
      </div>
    </div>
  );
};

export default TaskAdder;
