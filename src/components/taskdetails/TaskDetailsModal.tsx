
import type React from "react";
import { useState } from "react";
import type { Task } from "../../redux/tasksSlice";
import "./TaskDetailsModal.css";

// Define the props expected by the TaskDetailsModal component
interface TaskDetailsModalProps {
  task: Task; // The task to display details for
  onClose: () => void; // Function to close the modal
  onUpdate: (updatedTask: Task) => void; // Function to update the task details
}

// TaskDetailsModal component: displays a modal dialog with task details,
// allowing users to update the task's status and priority.
const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onUpdate,
}) => {
  // Initialize state with the task details so that they can be edited
  const [editedTask, setEditedTask] = useState(task);

  // Handle changes in the select inputs (for status and priority)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Update only the changed property while preserving the rest of the task details
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    onUpdate(editedTask); // Call the update function with the edited task details
  };

  return (
    // The modal overlay with role="dialog" and aria-modal="true" to indicate a modal dialog.
    // aria-labelledby points to the header (modal title) for screen readers.
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        {/* Header with a unique id for accessibility */}
        <header id="modal-title">Task Details</header>
        {/* Display read-only task details */}
        <p>
          <strong>Title:</strong> {task.title}
        </p>
        <p>
          <strong>Description:</strong> {task.description}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
        {/* Form for editing task details */}
        <form onSubmit={handleSubmit} aria-label="Edit task details">
          {/* Status selection */}
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={editedTask.status}
              onChange={handleChange}
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          {/* Priority selection */}
          <div>
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Action buttons */}
          <div className="modal-actions">
            {/* Cancel button: type "button" prevents form submission */}
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            {/* Submit button to save changes */}
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
