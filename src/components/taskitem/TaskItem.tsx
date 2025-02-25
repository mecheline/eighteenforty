import type React from "react";
import type { Task } from "../../redux/tasksSlice";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-item" onClick={onEdit}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <div className="task-meta">
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span>Priority: {task.priority}</span>
          <span>Status: {task.status}</span>
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
