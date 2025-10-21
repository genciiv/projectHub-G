import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import PostProject from "./pages/PostProject.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      {
        path: "/post-project",
        element: (
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        ),
      },
      { path: "/blog", element: <Blog /> },
      {
        path: "/blog/new", // <--- kjo rrugë statike ka prioritet mbi /blog/:id
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "/blog/:id", // për postet ekzistuese
        element: <BlogPost />,
      },
      { path: "/profile/:id", element: <Profile /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
