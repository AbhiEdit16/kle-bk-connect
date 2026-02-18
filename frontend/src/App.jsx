import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/admin" element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              <Route path="/student" element={
                <PrivateRoute roles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />

              <Route path="/organizer" element={
                <PrivateRoute roles={['organizer']}>
                  <OrganizerDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <footer className="bg-kle-dark text-white text-center py-6 mt-auto border-t-4 border-kle-gold">
            <div className="container mx-auto px-4">
              <p className="font-medium text-lg">&copy; 2026 Karnataka Lingayat Education Society – BK BCA College</p>
              <p className="text-sm text-gray-400 mt-2">Empowering Education with Technology</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
