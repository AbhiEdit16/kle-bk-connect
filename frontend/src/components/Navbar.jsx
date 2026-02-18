import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-kle-maroon shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-white p-1 rounded-full shadow-md transition-transform group-hover:scale-105">
                            {/* Placeholder for Logo - replace with actual img tag if available */}
                            <div className="w-10 h-10 rounded-full bg-kle-maroon flex items-center justify-center text-white font-bold border-2 border-kle-gold">
                                KLE
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white tracking-wide">KLE-BK Connect</span>
                            <span className="text-xs text-kle-gold font-medium uppercase tracking-wider">Event Management Portal</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-100 hover:text-kle-gold font-medium transition-colors">Events</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white bg-white/10 px-3 py-1 rounded-full border border-kle-gold/30">
                                    <User className="w-4 h-4 text-kle-gold" />
                                    <span className="font-medium text-sm">{user.name}</span>
                                </div>

                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-white hover:text-kle-gold font-medium transition">Dashboard</Link>
                                )}
                                {user.role === 'student' && (
                                    <Link to="/student" className="text-white hover:text-kle-gold font-medium transition">Dashboard</Link>
                                )}
                                {user.role === 'organizer' && (
                                    <Link to="/organizer" className="text-white hover:text-kle-gold font-medium transition">Dashboard</Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-red-200 hover:text-white font-medium transition ml-2"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="text-white font-medium hover:text-kle-gold transition">Login</Link>
                                <Link to="/register" className="bg-kle-gold text-kle-dark px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-white/10 animate-fade-in">
                        <div className="flex flex-col space-y-3 mt-2">
                            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-100 hover:text-kle-gold font-medium px-2 py-1">Events</Link>
                            {user ? (
                                <>
                                    <div className="px-2 py-2 text-sm text-kle-gold border-b border-white/10 mb-2">
                                        Signed in as <span className="font-bold text-white">{user.name}</span>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="text-white hover:text-kle-gold font-medium px-2">Admin Dashboard</Link>
                                    )}
                                    {user.role === 'student' && (
                                        <Link to="/student" onClick={() => setIsOpen(false)} className="text-white hover:text-kle-gold font-medium px-2">Student Dashboard</Link>
                                    )}
                                    {user.role === 'organizer' && (
                                        <Link to="/organizer" onClick={() => setIsOpen(false)} className="text-white hover:text-kle-gold font-medium px-2">Organizer Dashboard</Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-red-300 hover:text-red-100 font-medium px-2 flex items-center gap-2 mt-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 mt-2 px-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-white font-medium hover:text-kle-gold">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="bg-kle-gold text-kle-dark px-4 py-2 rounded-md font-bold text-center">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
