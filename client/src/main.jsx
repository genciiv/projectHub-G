// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Context & Layout
import { AuthProvider } from "./context/AuthContext.jsx";
import RootLayout from "./layout/RootLayout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import PostProject from "./pages/PostProject.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Styles
import "./index.css";

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
    path: "/blog",
    element: (
      <RootLayout>
        <Blog />
      </RootLayout>
    ),
  },
  {
    path: "/blog/:id",
    element: (
      <RootLayout>
        <BlogPost />
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
    path: "/profile/:id",
    element: (
      <RootLayout>
        <Profile />
      </RootLayout>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <ProfileEdit />
        </ProtectedRoute>
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
