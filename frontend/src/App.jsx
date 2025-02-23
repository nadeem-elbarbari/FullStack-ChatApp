import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import { useEffect } from 'react';
import Loader from './components/Loader.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
    const { checkAuth, user, isCheckingAuth, onlineUsersId } = useAuthStore();
    console.log('onlineUsersId :', onlineUsersId);

    const { theme } = useThemeStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        checkAuth();
        console.log('Online Users:', onlineUsersId);

    }, [checkAuth, theme]);

    if (isCheckingAuth && !user) {
        return <Loader />;
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
