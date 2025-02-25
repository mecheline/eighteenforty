"use client";

import type React from "react";
import { useState } from "react";
import type { Task } from "../../redux/tasksSlice";
import "./TaskDetailsModal.css";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onUpdate,
}) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedTask);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Details</h2>
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
        <form onSubmit={handleSubmit}>
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
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
