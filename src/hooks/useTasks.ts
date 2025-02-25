"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  addTask,
  updateTask,
  deleteTask,
  type Task,
} from "../redux/tasksSlice";

export const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      JSON.parse(storedTasks).forEach((task: Task) => dispatch(addTask(task)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addNewTask = (task: Task) => {
    dispatch(addTask(task));
  };

  const updateExistingTask = (task: Task) => {
    dispatch(updateTask(task));
  };

  const deleteExistingTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  return {
    tasks,
    addNewTask,
    updateExistingTask,
    deleteExistingTask,
  };
};
