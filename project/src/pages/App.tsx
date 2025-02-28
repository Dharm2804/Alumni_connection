import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from './Home';
import AlumniDirectory from './AlumniDirectory';
import JobPortal from './JobPortal';
import Events from './Events';
import Donate from './Donate';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/alumni"
              element={
                <ProtectedRoute>
                  <AlumniDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donate"
              element={
                <ProtectedRoute>
                  <Donate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;