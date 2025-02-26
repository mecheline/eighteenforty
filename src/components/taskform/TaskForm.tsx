// Import necessary modules and types from React and other files
import type React from "react";
import { useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../../redux/tasksSlice";
import "./TaskForm.css";
import Input from "../../shared/input/Input"; // Custom Input component
import Label from "../../shared/label/Label"; // Custom Label component
import { toast } from "sonner";

// Define the props for the TaskForm component
interface TaskFormProps {
  // Callback function to add a new task; expects a Task object as argument
  onAddTask: (task: Task) => void;
}

// TaskForm component definition: renders a form for adding a new task
const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  // State variables for form fields
  const [title, setTitle] = useState(""); // Task title
  const [description, setDescription] = useState(""); // Task description
  const [dueDate, setDueDate] = useState(""); // Task due date
  const [priority, setPriority] = useState<TaskPriority | "">(""); // Task priority (low, medium, high)
  const [status, setStatus] = useState<TaskStatus | "">(""); // Task status (to-do, in-progress, done)
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle form submission event
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate that both priority and status are selected; if not, show an alert.
    if (!priority || !status) {
      toast.error("Please select both priority and status");
      return;
    }

    // Create a new task object using the form input values
    const newTask: Task = {
      // Generate a simple unique ID using a random string
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      dueDate,
      priority,
      status,
    };

    // Call the provided onAddTask callback with the new task object
    onAddTask(newTask);

    // Clear the form fields after submission to prepare for new input
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");

    // Hide form after submission
    setIsFormVisible(false);
  };

  return (
    // Using <form> element to semantically represent a data entry form.
    // The form includes aria-label to provide additional context.
    <div className="task-form">
      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="add-task-button"
          aria-expanded={isFormVisible}
        >
          <span className="plus-icon">+</span>
          Add New Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} aria-label="Add new task form">
          {/* Container for title and description fields */}
          <div className="title_textarea_style">
            <div className="title-textarea">
              {/* Label for title input using a custom Label component.
              The 'htmlFor' attribute connects the label to the input element with matching id. */}
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true" // ARIA attribute to indicate this field is required
              />
            </div>
            <div className="title-textarea">
              {/* Label for description textarea */}
              <Label htmlFor="description">Description</Label>
              {/* Using a native <textarea> for multi-line text input.
              'required' attribute makes the field mandatory. */}
              <textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                aria-required="true"
              />
            </div>
          </div>
          {/* Container for due date, priority, and status fields */}
          <div className="date_priority_status_style">
            <div className="date_priority_status">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div className="date_priority_status">
              <Label htmlFor="priority">Priority</Label>
              {/* Select element for priority */}
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                required
                aria-required="true"
              >
                {/* Default disabled option prompting user to select a value */}
                <option value="" disabled>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="date_priority_status">
              <Label htmlFor="status">Status</Label>
              {/* Select element for status */}
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                required
                aria-required="true"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          {/* Submit button for the form.
          Use a clear button label and ensure it's keyboard accessible. */}
          <div className="button-group">
            <button type="submit" aria-label="Add Task" className="add_btn">
              Add Task
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
