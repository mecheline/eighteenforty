import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TaskList from "../tasklist/TaskList";

const mockStore = configureStore([]);

describe("TaskList", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      tasks: {
        tasks: [
          {
            id: "1",
            title: "Task 1",
            description: "Description 1",
            dueDate: "2023-06-01",
            priority: "high",
            status: "to-do",
            order: 0,
          },
          {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            dueDate: "2023-06-02",
            priority: "medium",
            status: "in-progress",
            order: 1,
          },
        ],
      },
    });
  });

  it("renders task list", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("filters tasks by status", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: /status/i }), {
      target: { value: "to-do" },
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("searches tasks", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), {
      target: { value: "Task 1" },
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });
});
