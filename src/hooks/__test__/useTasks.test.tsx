import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../../redux/tasksSlice";
import { useTasks } from "../useTasks";
import React from "react";

describe("useTasks", () => {
  // Create a wrapper that provides the Redux store.
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={configureStore({ reducer: { tasks: tasksReducer } })}>
      {children}
    </Provider>
  );

  it("should add a new task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => {
      result.current.addNewTask({
        id: "1",
        title: "New Task",
        description: "Description",
        dueDate: "2023-06-01",
        priority: "medium",
        status: "to-do",
        
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("New Task");
  });

  it("should update an existing task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => {
      result.current.addNewTask({
        id: "1",
        title: "Task",
        description: "Description",
        dueDate: "2023-06-01",
        priority: "medium",
        status: "to-do",
        
      });
    });

    act(() => {
      result.current.updateExistingTask({
        id: "1",
        title: "Updated Task",
        description: "Updated Description",
        dueDate: "2023-06-02",
        priority: "high",
        status: "in-progress",
        
      });
    });

    expect(result.current.tasks[0].title).toBe("Updated Task");
    expect(result.current.tasks[0].status).toBe("in-progress");
  });

  it("should delete a task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => {
      result.current.addNewTask({
        id: "1",
        title: "Task to Delete",
        description: "Description",
        dueDate: "2023-06-01",
        priority: "medium",
        status: "to-do",
        
      });
    });

    act(() => {
      result.current.deleteExistingTask("1");
    });

    expect(result.current.tasks).toHaveLength(0);
  });
});
