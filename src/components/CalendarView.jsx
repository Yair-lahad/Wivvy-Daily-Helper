import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import TaskPool from './TaskPool';
import TodoList from './TodoList';
import CurrentDayView from './CurrentDayView';
import { taskIcons, dayNames, monthNames } from '../assets/consts';
import { formatDateKey, generateCalendarDays, loadFromStorage, saveToStorage } from '../assets/utils';
import '../App.css';


const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState('work');

  const [todoList, setTodoList] = useState(() => loadFromStorage('wivvy-todo-list', []));
  const [tasks, setTasks] = useState(() => loadFromStorage('wivvy-calendar-tasks', {}));
  const [poolTasks, setPoolTasks] = useState(() => loadFromStorage('wivvy-pool-tasks', []));

  useEffect(() => saveToStorage('wivvy-todo-list', todoList), [todoList]);
  useEffect(() => saveToStorage('wivvy-calendar-tasks', tasks), [tasks]);
  useEffect(() => saveToStorage('wivvy-pool-tasks', poolTasks), [poolTasks]);

  const handleAddToPool = (task) => {
    const taskKey = `${task.type}-${task.title.toLowerCase().trim()}`;
    const exists = poolTasks.some(
      (t) => `${t.type}-${t.title.toLowerCase().trim()}` === taskKey
    );
    if (!exists) {
      setPoolTasks(prev => [...prev, { ...task, id: taskKey }]);
    } else {
      alert('Duplicate task not allowed');
    }
  };

  const handleDeleteFromPool = (taskId) => {
    setPoolTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addTask = (date, taskType, title) => {
    const dateKey = formatDateKey(date);
    const taskKey = `${taskType}-${title.toLowerCase().trim()}`;
    const isFromPool = poolTasks.some(t => t.id === taskKey);

    const newTask = {
      id: isFromPool ? taskKey : `custom-${Date.now()}`,
      type: taskType,
      title,
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
            onToggle={id =>
              setTodoList(prev =>
                prev.map(todo =>
                  todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
              )
            }
            onDelete={id => setTodoList(prev => prev.filter(todo => todo.id !== id))}
            onAdd={text =>
              setTodoList(prev => [
                ...prev,
                { id: Date.now(), text, completed: false }
              ])
            }
          />

          {/* Calendar */}
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
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}

              {calendarDays.map((date, idx) => {
                const dateKey = formatDateKey(date);
                const dayTasks = tasks[dateKey] || [];
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDate(date)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      const droppedTask = JSON.parse(e.dataTransfer.getData('application/json'));
                      const key = formatDateKey(date);
                      setTasks(prev => ({
                        ...prev,
                        [key]: [...(prev[key] || []), {
                          ...droppedTask,
                          id: `custom-${Date.now()}`
                        }]
                      }));
                    }}
                  >
                    <div className="day-number">{date.getDate()}</div>
                    <div className="task-icons">
                      {dayTasks.slice(0, 3).map(task => {
                        const Icon = taskIcons[task.type]?.icon;
                        return (
                          Icon && (
                            <div
                              key={task.id}
                              className={`task-icon ${taskIcons[task.type]?.color || ''} ${task.completed ? 'completed' : ''}`}
                              onClick={e => {
                                e.stopPropagation();
                                toggleTask(dateKey, task.id);
                              }}
                              title={task.title}
                            >
                              <Icon size={12} />
                            </div>
                          )
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
            onToggle={id => toggleTask(formatDateKey(selectedDate), id)}
            onDelete={id => {
              const dateKey = formatDateKey(selectedDate);
              setTasks(prev => ({
                ...prev,
                [dateKey]: prev[dateKey].filter(t => t.id !== id)
              }));
            }}
            onRequestAddTaskModal={() => setShowTaskModal(true)}
          />
        </div>

        {/* Optional modal (unused now) */}
        {showTaskModal && (
          <TaskModal
            selectedDate={selectedDate}
            selectedTaskType={selectedTaskType}
            setSelectedTaskType={setSelectedTaskType}
            addTask={addTask}
            onClose={() => setShowTaskModal(false)}
            poolTasks={poolTasks}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView;
