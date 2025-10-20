// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Layout & Guards
import RootLayout from "./layout/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages bazë
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Projects
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PostProject from "./pages/PostProject";


// Blog
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";

const router = createBrowserRouter([
  { path: "/", element: <RootLayout><Home /></RootLayout> },

  // Auth
  { path: "/login", element: <RootLayout><Login /></RootLayout> },
  { path: "/register", element: <RootLayout><Register /></RootLayout> },

  // Dashboard (protected)
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

  // Projects
  { path: "/projects", element: <RootLayout><Projects /></RootLayout> },
  { path: "/projects/:id", element: <RootLayout><ProjectDetail /></RootLayout> },
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

 
  // Blog
  { path: "/blog", element: <RootLayout><Blog /></RootLayout> },
  {
    path: "/blog/new",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <BlogEditor />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/blog/edit/:id",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <BlogEditor />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  { path: "/blog/:id", element: <RootLayout><BlogPost /></RootLayout> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
