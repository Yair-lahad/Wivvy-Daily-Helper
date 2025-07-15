import React from 'react';
import TaskAdder from './TaskAdder';
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

const TaskPool = () => {
  const [customTasks, setCustomTasks] = React.useState([]);

  const handleAddTask = (task) => {
    const exists = customTasks.some(t => t.title === task.title && t.type === task.type);
    if (!exists) {
      setCustomTasks(prev => [...prev, task]);
    } else {
      alert('Duplicate task not allowed.');
    }
  };

  return (
    <div className="task-pool">
      <h3>Task Pool</h3>

      <TaskAdder onAddTask={handleAddTask} />

      <h4>Templates</h4>
      <div className="task-pool-grid">
        {Object.entries(taskIcons).map(([type, { icon: Icon, color, label }]) => (
          <div key={type} className={`task-pool-item ${color}`}>
            <Icon size={24} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {customTasks.length > 0 && (
        <>
          <h4 style={{ marginTop: '1rem' }}>Custom Tasks</h4>
          <div className="task-pool-grid">
            {customTasks.map((task) => {
              const Icon = taskIcons[task.type].icon;
              const color = taskIcons[task.type].color;
              return (
                <div key={task.id} className={`task-pool-item ${color}`}>
                  <Icon size={24} />
                  <span>{task.title}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskPool;
