// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Context & Layout
import { AuthProvider } from "./context/AuthContext.jsx";
import RootLayout from "./layout/RootLayout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import PostProject from "./pages/PostProject.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Styles
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      // Projects
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetail /> },
      {
        path: "post-project",
        element: (
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        ),
      },

      // Blog
      { path: "blog", element: <Blog /> },
      {
        path: "blog/new", // rrugë statike për të shmangur konflikt me :id
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
      },
      { path: "blog/:id", element: <BlogPost /> },

      // Profile
      { path: "profile/:id", element: <Profile /> },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },

      // Dashboard (protected)
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
