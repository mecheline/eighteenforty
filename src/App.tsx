import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";
import TaskList from "./components/tasklist/TaskList";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./shared/theme/ThemeToggle";

// import TaskModal from "./components/TaskModal";

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <Suspense fallback={<div>Loading...</div>}>
          <TaskList />
        </Suspense>
      </div>
    </ThemeProvider>
    {/* <TaskModal /> */}
    {/* </PersistGate> */}
  </Provider>
);

export default App;
