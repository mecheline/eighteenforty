"use client";

import type React from "react";
import { useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../../redux/tasksSlice";
import "./TaskForm.css";
import Input from "../../shared/input/Input";
import Label from "../../shared/label/Label";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [status, setStatus] = useState<TaskStatus | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priority || !status) {
      alert("Please select both priority and status");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      status,
    };
    onAddTask(newTask);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Label htmlFor="description">Description</Label>
      <textarea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Label htmlFor="date">Date</Label>
      <Input
        id="date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <Label htmlFor="priority">Priority</Label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        required
      >
        <option value="" disabled>
          Select priority
        </option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Label htmlFor="status">Status</Label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        required
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
