import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import TaskPool from './TaskPool';
import TodoList from './TodoList';
import CurrentDayView from './CurrentDayView';
import { taskIcons, dayNames, monthNames } from '../assets/consts';
import { formatDateKey, generateCalendarDays } from '../assets/utils';
import '../App.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState('work');
  const [todoList, setTodoList] = useState(() => {
    const stored = localStorage.getItem('wivvy-todo-list');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('wivvy-todo-list', JSON.stringify(todoList));
  }, [todoList]);

  // Load calendar tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('wivvy-calendar-tasks');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading calendar tasks:', error);
      return {};
    }
  });

  // Load pool tasks from localStorage
  const [poolTasks, setPoolTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('wivvy-pool-tasks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading pool tasks:', error);
      return [];
    }
  });

  // Save calendar tasks on change
  useEffect(() => {
    try {
      localStorage.setItem('wivvy-calendar-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving calendar tasks:', error);
    }
  }, [tasks]);

  // Save pool tasks on change
  useEffect(() => {
    try {
      localStorage.setItem('wivvy-pool-tasks', JSON.stringify(poolTasks));
    } catch (error) {
      console.error('Error saving pool tasks:', error);
    }
  }, [poolTasks]);

  const handleAddToPool = (task) => {
    const taskKey = `${task.type}-${task.title.toLowerCase().trim()}`;
    if (!poolTasks.some(t => `${t.type}-${t.title.toLowerCase().trim()}` === taskKey)) {
      const newTask = {
        ...task,
        id: taskKey // Use consistent ID format
      };
      setPoolTasks(prev => [...prev, newTask]);
    } else {
      alert('Duplicate task not allowed');
    }
  };

  const handleDeleteFromPool = (taskId) => {
    // Remove from pool
    setPoolTasks(prev => prev.filter(t => t.id !== taskId));

    // Also remove from all calendar dates
    setTasks(prev => {
      const updated = { ...prev };
      for (const [dateKey, dayTasks] of Object.entries(prev)) {
        const filtered = dayTasks.filter(task => {
          // Check both the task ID and the constructed ID for backwards compatibility
          const constructedId = `${task.type}-${task.title.toLowerCase().trim()}`;
          return task.id !== taskId && constructedId !== taskId;
        });
        if (filtered.length > 0) {
          updated[dateKey] = filtered;
        } else {
          delete updated[dateKey]; // Remove empty date entries
        }
      }
      return updated;
    });
  };

  const addTask = (date, taskType, title) => {
    const dateKey = formatDateKey(date);

    // Use consistent ID format - check if it's from pool or new task
    const taskKey = `${taskType}-${title.toLowerCase().trim()}`;
    const isFromPool = poolTasks.some(t => t.id === taskKey);

    const newTask = {
      id: isFromPool ? taskKey : `custom-${Date.now()}`, // Use pool ID if from pool, otherwise unique ID
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

  const calendarDays = generateCalendarDays(selectedDate);

  return (
    <div className="app">
      <div className="container">
        <TaskPool
          poolTasks={poolTasks}
          onAddTask={handleAddToPool}
          onDeleteTask={handleDeleteFromPool}
        />
        <div className="container calendar-layout">
          <TodoList
            todos={todoList}
            onToggle={(id) =>
              setTodoList(prev =>
                prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
              )
            }
            onDelete={(id) =>
              setTodoList(prev => prev.filter(todo => todo.id !== id))
            }
            onAdd={(text) => {
              const newTodo = {
                id: Date.now(),
                text,
                completed: false
              };
              setTodoList(prev => [...prev, newTodo]);
            }}
          />

          {/* Calendar Section */}
          <div className="calendar-container">
            <div className="calendar-header">
              <button
                className="nav-button"
                onClick={() =>
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
                }
              >
                ←
              </button>
              <h2 className="month-title">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button
                className="nav-button"
                onClick={() =>
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
                }
              >
                →
              </button>
            </div>

            <div className="calendar-grid">
              {/* Weekday Headers */}
              {dayNames.map(day => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((date, index) => {
                const dateKey = formatDateKey(date);
                const dayTasks = tasks[dateKey] || [];
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                    onClick={() => { setSelectedDate(date); setShowTaskModal(date) }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const task = JSON.parse(e.dataTransfer.getData('application/json'));
                      const newTask = {
                        ...task,
                        id: Date.now()
                      };
                      const key = formatDateKey(date);
                      setTasks(prev => ({
                        ...prev,
                        [key]: [...(prev[key] || []), newTask]
                      }));
                    }}
                  >

                    <div className="day-number">{date.getDate()}</div>
                    <div className="task-icons">
                      {dayTasks.slice(0, 3).map(task => {
                        const IconComponent = taskIcons[task.type]?.icon;
                        if (!IconComponent) {
                          console.warn(`No icon found for task type: ${task.type}`);
                          return null;
                        }

                        return (
                          <div
                            key={task.id}
                            className={`task-icon ${taskIcons[task.type]?.color || ''} ${task.completed ? 'completed' : ''
                              }`}
                            onClick={e => {
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
          <CurrentDayView
            date={selectedDate}
            tasks={tasks[formatDateKey(selectedDate)] || []}
            onToggle={(id) => toggleTask(formatDateKey(selectedDate), id)}
            onDelete={(id) => {
              const dateKey = formatDateKey(selectedDate);
              setTasks(prev => ({
                ...prev,
                [dateKey]: prev[dateKey].filter(t => t.id !== id)
              }));
            }}
          />
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <TaskModal
            showDate={showTaskModal}
            selectedTaskType={selectedTaskType}
            setSelectedTaskType={setSelectedTaskType}
            addTask={addTask}
            onClose={() => setShowTaskModal(false)}
            poolTasks={poolTasks} // Pass pool tasks to modal for selection
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView;