import React from 'react';
import TaskAdder from './TaskAdder';
import { taskIcons } from '../assets/consts';

const TaskPool = ({ poolTasks, onAddTask, onDeleteTask }) => {
    return (
        <div className="task-pool">
            <h3>Task Pool</h3>
            <TaskAdder onAddTask={onAddTask} />
            <div className="task-pool-grid">
                {poolTasks.map(task => {
                    const Icon = taskIcons[task.type]?.icon || null;
                    return (
                        <div
                            key={task.id}
                            className={`task-pool-item ${taskIcons[task.type]?.color || 'gray'}`}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify(task));
                            }}
                        >
                            {Icon && <Icon size={24} />}
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
