"use client";

import type React from "react";
import { useState, useMemo } from "react";
import type { Task, TaskPriority, TaskStatus } from "../../redux/tasksSlice";
import { useTasks } from "../../hooks/useTasks";
import TaskItem from "../taskitem/TaskItem";
import TaskForm from "../taskform/TaskForm";
import TaskDetailsModal from "../taskdetails/TaskDetailsModal";
import DeleteConfirmationModal from "../../shared/deleteconfirmation/DeleteConfirmationModal";
import { useTheme } from "../../context/ThemeContext";
import { toast, Toaster } from "sonner";

import "./TaskList.css";

const TaskList: React.FC = () => {
  const { theme } = useTheme();
  const { tasks, addNewTask, updateExistingTask, deleteExistingTask } =
    useTasks();
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          (!filter.status || task.status === filter.status) &&
          (!filter.priority || task.priority === filter.priority) &&
          (task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          return (
            priorityOrder[b.priority as TaskPriority] -
            priorityOrder[a.priority as TaskPriority]
          );
        }
      });
  }, [tasks, filter, search, sortBy]);

  const handleAddTask = (newTask: Task) => {
    addNewTask(newTask);
    toast.success(`Task "${newTask.title}" has been added.`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateExistingTask(updatedTask);
    toast.success(`Task "${updatedTask.title}" has been updated.`);
    setSelectedTask(null);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteExistingTask(taskToDelete.id);
      toast.success(`Task "${taskToDelete.title}" has been deleted.`);
      setTaskToDelete(null);
    }
  };

  return (
    <div className={`task-list ${theme}`}>
      <h1>Task Management</h1>
      <TaskForm onAddTask={handleAddTask} />
      <div className="task-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter.status || ""}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value as TaskStatus })
          }
        >
          <option value="">All Statuses</option>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filter.priority || ""}
          onChange={(e) =>
            setFilter({ ...filter, priority: e.target.value as TaskPriority })
          }
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority")}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>
      <div className="task-items">
        {filteredAndSortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={() => setSelectedTask(task)}
            onDelete={() => setTaskToDelete(task)}
          />
        ))}
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}
      {taskToDelete && (
        <DeleteConfirmationModal
          taskTitle={taskToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
      <Toaster position="top-center" theme={theme} richColors />
    </div>
  );
};

export default TaskList;
