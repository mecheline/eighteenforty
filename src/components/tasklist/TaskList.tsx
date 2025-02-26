import type React from "react";
import { useState, useMemo, lazy, Suspense } from "react";
// Import types for Task, Priority, and Status from Redux slice
import type { Task, TaskPriority, TaskStatus } from "../../redux/tasksSlice";
// Import custom hook for managing tasks
import { useTasks } from "../../hooks/useTasks";
// Import TaskForm component for adding new tasks
import TaskForm from "../taskform/TaskForm";
// Import custom hook to access theme
import { useTheme } from "../../context/ThemeContext";
// Import toast notifications library (Sonner)
import { toast, Toaster } from "sonner";
// Import shared Input component
import Input from "../../shared/input/Input";
// Import CSS styling for this component
import "./TaskList.css";

// Lazy load components for performance improvements
const TaskItem = lazy(() => import("../taskitem/TaskItem"));
const TaskDetailsModal = lazy(() => import("../taskdetails/TaskDetailsModal"));
const DeleteConfirmationModal = lazy(
  () => import("../../shared/deleteconfirmation/DeleteConfirmationModal")
);

// TaskList component: displays and manages the task list
const TaskList: React.FC = () => {
  // Get the current theme from context
  const { theme } = useTheme();
  // Destructure tasks and CRUD functions from the custom hook
  const { tasks, addNewTask, updateExistingTask, deleteExistingTask } =
    useTasks();

  // State for filtering tasks by status and priority
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});
  // State for search input
  const [search, setSearch] = useState("");
  // State for sorting method: by due date or priority
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  // State for selected task (for editing details)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // State for task to be deleted (to confirm deletion)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Memoized filtering and sorting logic to avoid unnecessary computations
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          // Filter by status if set
          (!filter.status || task.status === filter.status) &&
          // Filter by priority if set
          (!filter.priority || task.priority === filter.priority) &&
          // Search by title or description (case-insensitive)
          (task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        // Sort tasks by due date or by priority
        if (sortBy === "dueDate") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          // Define numeric order for priorities
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          return (
            priorityOrder[b.priority as TaskPriority] -
            priorityOrder[a.priority as TaskPriority]
          );
        }
      });
  }, [tasks, filter, search, sortBy]);

  // Handler for adding a new task
  const handleAddTask = (newTask: Task) => {
    addNewTask(newTask);
    toast.success(`Task "${newTask.title}" has been added.`);
  };

  // Handler for updating an existing task
  const handleUpdateTask = (updatedTask: Task) => {
    updateExistingTask(updatedTask);
    toast.success(`Task "${updatedTask.title}" has been updated.`);
    // Close the details modal after updating
    setSelectedTask(null);
  };

  // Handler for confirming deletion of a task
  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteExistingTask(taskToDelete.id);
      toast.success(`Task "${taskToDelete.title}" has been deleted.`);
      setTaskToDelete(null);
    }
  };

  console.log(filteredAndSortedTasks);
  console.log(tasks);

  return (
    // Use <main> for primary content; add a dynamic class based on the theme.
    <main
      className={`task-list ${theme}`}
      aria-label="Task Management Application"
    >
      {/* Header for the page */}
      <header>
        <h1>Task Management</h1>
      </header>

      {/* TaskForm component to add new tasks.
          The onAddTask prop is handled by handleAddTask.
          Ensure the form is accessible by labeling and proper form structure. */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Section for filtering controls */}
      <section className="task-filters" aria-label="Filter tasks">
        <Input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        <select
          value={filter.status || ""}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value as TaskStatus })
          }
          aria-label="Filter by status"
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
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority")}
          aria-label="Sort tasks"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </section>
      <hr />

      {/* Section for displaying the list of tasks */}
      <section className="task-items" aria-label="List of tasks">
        {/* Suspense fallback for lazy-loaded components */}
        <Suspense fallback={<div className="loader">Loading tasks...</div>}>
          {filteredAndSortedTasks.length > 0 && tasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                // onEdit opens the task details modal
                onEdit={() => setSelectedTask(task)}
                // onDelete triggers deletion confirmation modal
                onDelete={() => setTaskToDelete(task)}
              />
            ))
          ) : filteredAndSortedTasks.length == 0 && tasks.length > 0 ? (
            <h4 className="no_match">No task matches the selected filter(s)</h4>
          ) : (
            <h4 className="no_task">Add new tasks...</h4>
          )}
        </Suspense>
      </section>

      {/* Suspense wrapper for modals */}
      <Suspense fallback={<div className="loader_details">Loading details...</div>}>
        {/* Modal for editing task details */}
        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
          />
        )}
        {/* Modal for confirming deletion of a task */}
        {taskToDelete && (
          <DeleteConfirmationModal
            taskTitle={taskToDelete.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setTaskToDelete(null)}
          />
        )}
      </Suspense>

      {/* Toast notifications for feedback; accessible via proper position and rich colors */}
      <Toaster position="top-center" theme={theme} richColors />
    </main>
  );
};

export default TaskList;
