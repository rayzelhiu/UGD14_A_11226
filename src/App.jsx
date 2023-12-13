import './App.css'
import Authentication from './pages/Authentication';
import TodoList from './pages/ToDoList';
import GroupChat from './pages/GroupChat';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Authentication/>
    },
    {
      path: "/todo",
      element: <TodoList/>
    },
    {
      path: "/chat",
      element: <GroupChat/>
    }
  ])

  return (
    <RouterProvider router = {router} />
  )
}

export default App