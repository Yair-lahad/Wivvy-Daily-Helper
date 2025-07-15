import React, { useState } from 'react';
import { Calendar, Plus, Coffee, Dumbbell, BookOpen, Briefcase, Heart, Home, Car, ShoppingCart, Users, Music } from 'lucide-react';
import TaskModal from './TaskModal';
import TaskPool from './TaskPool';
import '../App.css';

const CalanderView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [poolTasks, setPoolTasks] = useState([]);
const [calendarTasks, setCalendarTasks] = useState({});

const handleAddToPool = (task) => {
  if (!poolTasks.some(t => t.title === task.title && t.type === task.type)) {
    setPoolTasks(prev => [...prev, task]);
  } else {
    alert('Duplicate task not allowed');
  }
};

const handleDeleteFromPool = (taskId) => {
  setPoolTasks(prev => prev.filter(t => t.id !== taskId));

  // Also delete from calendar
  const updated = {};
  for (const [dateKey, tasks] of Object.entries(calendarTasks)) {
    const filtered = tasks.filter(task => task.id !== taskId);
    if (filtered.length > 0) updated[dateKey] = filtered;
  }
  setCalendarTasks(updated);
};


  // Available task icons
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

  const [selectedTaskType, setSelectedTaskType] = useState('work');

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addTask = (date, taskType, title) => {
    const dateKey = formatDateKey(date);
    const newTask = {
      id: Date.now(),
      type: taskType,
      title: title,
      completed: false
    };

    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask]
    }));
    setShowTaskModal(false);
  };

  const toggleTask = (dateKey, taskId) => {
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="app">
      <div className="container">
        <TaskPool /> {/* NEW POOL */}
        {/* Calendar Section */}
        <div className="calendar-container">
          <div className="calendar-header">
            <button
              className="nav-button"
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            >
              ←
            </button>
            <h2 className="month-title">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h2>
            <button
              className="nav-button"
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const dayTasks = tasks[dateKey] || [];
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                  onClick={() => setShowTaskModal(date)}
                >
                  <div className="day-number">{date.getDate()}</div>
                  <div className="task-icons">
                    {dayTasks.slice(0, 3).map(task => {
                      const IconComponent = taskIcons[task.type].icon;
                      return (
                        <div
                          key={task.id}
                          className={`task-icon ${taskIcons[task.type].color} ${task.completed ? 'completed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(dateKey, task.id);
                          }}
                          title={task.title}
                        >
                          <IconComponent size={12} />
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <div className="task-icon overflow">
                        <span>+{dayTasks.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <TaskModal
            showDate={showTaskModal}
            selectedTaskType={selectedTaskType}
            setSelectedTaskType={setSelectedTaskType}
            addTask={addTask}
            onClose={() => setShowTaskModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CalanderView;