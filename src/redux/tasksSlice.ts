import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "to-do" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  // order?: number;
}

interface TasksState {
  tasks: Task[];
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  setError,
  clearError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
