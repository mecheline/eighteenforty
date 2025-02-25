import type React from "react";
import type { Task } from "../../redux/tasksSlice";
import "./TaskItem.css";

// Define the props for TaskItem component
interface TaskItemProps {
  task: Task; // Task object containing title, dueDate, etc.
  onEdit: () => void; // Function to call when editing the task
  onDelete: (id: string) => void; // Function to call when deleting the task
}

// TaskItem component displays a task's details and allows editing or deletion.
// It uses semantic HTML, is keyboard accessible, and includes ARIA attributes for screen readers.
const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  // Handle key events for accessibility. Trigger onEdit if "Enter" or "Space" is pressed.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    // Using <article> to represent an independent piece of content.
    // tabIndex makes it focusable via keyboard, and aria-label describes its function.
    <article
      className="task-item"
      onClick={onEdit}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Edit task: ${task.title}`}
    >
      {/* Section containing the task content */}
      <section className="task-content">
        <h3>{task.title}</h3>
        {/* Display task metadata */}
        <div className="task-meta">
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span>Priority: {task.priority}</span>
          <span>Status: {task.status}</span>
        </div>
      </section>
      {/* Section for action buttons */}
      <section className="task-actions">
        {/* Delete button with an aria-label for clarity.
            e.stopPropagation() prevents the click from triggering the parent onClick handler. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="delete-btn"
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </section>
    </article>
  );
};

export default TaskItem;
