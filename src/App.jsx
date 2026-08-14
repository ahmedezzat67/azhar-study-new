import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetails from "./pages/SubjectDetails";
import LessonPage from "./pages/LessonPage";
import Quizzes from "./pages/Quizzes";
import Flashcards from "./pages/Flashcards";
import Calendar from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import Review from "./pages/Review";

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/subjects"
          element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/subjects/:id"
          element={
            isAuthenticated ? <SubjectDetails /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/lessons/:id"
          element={isAuthenticated ? <LessonPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/quizzes"
          element={isAuthenticated ? <Quizzes /> : <Navigate to="/login" />}
        />
        <Route
          path="/flashcards"
          element={isAuthenticated ? <Flashcards /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />}
        />
        <Route
          path="/statistics"
          element={isAuthenticated ? <Statistics /> : <Navigate to="/login" />}
        />
        <Route
          path="/achievements"
          element={
            isAuthenticated ? <Achievements /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/favorites"
          element={isAuthenticated ? <Favorites /> : <Navigate to="/login" />}
        />
        <Route
          path="/review"
          element={isAuthenticated ? <Review /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
