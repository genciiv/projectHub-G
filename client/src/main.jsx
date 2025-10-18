// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import RootLayout from "./layout/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth & Dashboard
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Faqet e ndara në file
import Home from "./pages/Home";
import Blog from "./pages/Blog";

// Hapi 4
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PostProject from "./pages/PostProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RootLayout>
        <Home />
      </RootLayout>
    ),
  },
  {
    path: "/blog",
    element: (
      <RootLayout>
        <Blog />
      </RootLayout>
    ),
  },

  {
    path: "/login",
    element: (
      <RootLayout>
        <Login />
      </RootLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <RootLayout>
        <Register />
      </RootLayout>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </RootLayout>
    ),
  },

  {
    path: "/projects",
    element: (
      <RootLayout>
        <Projects />
      </RootLayout>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <RootLayout>
        <ProjectDetail />
      </RootLayout>
    ),
  },
  {
    path: "/post-project",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <PostProject />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
