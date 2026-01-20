import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div style={{ minHeight: '80vh' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/event/:id" element={<EventDetails />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Add Admin Route here */}
                    </Routes>
                </div>
                <Chatbot />
            </Router>
        </AuthProvider>
    );
}

export default App;
