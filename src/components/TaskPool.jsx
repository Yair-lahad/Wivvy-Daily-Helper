import React from 'react';
import TaskAdder from './TaskAdder';
import { taskIcons } from '../assets/consts';

const TaskPool = ({ poolTasks, onAddTask, onDeleteTask }) => {
    return (
        <div className="task-pool">
            <h3>Templates</h3>
            <TaskAdder
                onAddTask={(type, title) =>
                    onAddTask({ type, title, completed: false })
                }
            />
            <div className="task-pool-grid">
                {poolTasks.map(task => {
                    const Icon = taskIcons[task.type]?.icon;
                    return (
                        <div
                            key={task.id}
                            className="task-pool-item"
                            draggable
                            onDragStart={(e) =>
                                e.dataTransfer.setData('application/json', JSON.stringify(task))
                            }
                        >
                            <span className={`task-icon ${taskIcons[task.type]?.color || ''}`}>
                                {Icon && <Icon size={14} />}
                            </span>
                            <span>{task.title}</span>
                            <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>×</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskPool;
