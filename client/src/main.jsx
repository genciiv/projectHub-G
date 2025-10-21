// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contexts
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Layout
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
import Feed from "./pages/Feed.jsx"; // për feed-in e personalizuar (nëse e ke krijuar)

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Styles
import "./index.css";

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "feed", element: <Feed /> },

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
        path: "blog/new",
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

      // Dashboard
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

// Render App
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);
