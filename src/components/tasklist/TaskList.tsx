import type React from "react";
import { useState, useMemo, lazy, Suspense, useEffect } from "react";
// Import types for Task, Priority, and Status from Redux slice
import type { Task, TaskPriority, TaskStatus } from "../../redux/tasksSlice";
import { useTasks } from "../../hooks/useTasks";
import TaskForm from "../taskform/TaskForm";
import { useTheme } from "../../context/ThemeContext";
import { toast, Toaster } from "sonner";
import Input from "../../shared/input/Input";
import "./TaskList.css";

// Import drag and drop components from react-beautiful-dnd
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

// Lazy load components
const TaskItem = lazy(() => import("../taskitem/TaskItem"));
const TaskDetailsModal = lazy(() => import("../taskdetails/TaskDetailsModal"));
const DeleteConfirmationModal = lazy(
  () => import("../../shared/deleteconfirmation/DeleteConfirmationModal")
);

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

  // Memoized filtering and sorting logic
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

  // Local state to manage the order of tasks (for drag and drop)
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(
    filteredAndSortedTasks
  );

  // Update local ordering when filtered tasks change
  useEffect(() => {
    setOrderedTasks(filteredAndSortedTasks);
  }, [filteredAndSortedTasks]);

  // Handle drag and drop reordering
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(orderedTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrderedTasks(items);
    // Optionally: update the order in your global store here if needed
  };

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
    <main
      className={`task-list ${theme}`}
      aria-label="Task Management Application"
    >
      <header>
        <h1>Task Management</h1>
      </header>

      <TaskForm onAddTask={handleAddTask} />

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

      {/* Wrap tasks list with DragDropContext and Droppable */}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Suspense fallback={<div className="loader">Loading tasks...</div>}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <section
                className="task-items"
                aria-label="List of tasks"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {orderedTasks.length > 0 ? (
                  orderedTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskItem
                            task={task}
                            onEdit={() => setSelectedTask(task)}
                            onDelete={() => setTaskToDelete(task)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : tasks.length > 0 ? (
                  <h4 className="no_match">
                    No task matches the selected filter(s)
                  </h4>
                ) : (
                  <h4 className="no_task">Add new tasks...</h4>
                )}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        </Suspense>
      </DragDropContext>

      <Suspense
        fallback={<div className="loader_details">Loading details...</div>}
      >
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
      </Suspense>

      <Toaster position="top-center" theme={theme} richColors />
    </main>
  );
};

export default TaskList;
