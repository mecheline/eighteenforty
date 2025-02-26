import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import TaskList from "./components/tasklist/TaskList";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./shared/theme/ThemeToggle";
import Header from "./shared/header/Header";

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider>
      <Header />
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <TaskList />
        </Suspense>
      </div>
    </ThemeProvider>
  </Provider>
);

export default App;
