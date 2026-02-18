import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [usn, setUsn] = useState('');
    const [sem, setSem] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role, usn, sem);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] bg-kle-cream relative py-10">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-20 w-24 h-24 bg-kle-maroon rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-kle-gold rounded-full opacity-10 blur-2xl"></div>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 border-t-4 border-kle-maroon animate-fade-in">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-kle-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UserPlus className="text-kle-maroon w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-kle-dark">Create Account</h2>
                    <p className="text-gray-500 mt-1">Join the KLE-BK Connect Community</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kle-maroon focus:border-transparent transition"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kle-maroon focus:border-transparent transition"
                            placeholder="student@example.com"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kle-maroon focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kle-maroon focus:border-transparent transition bg-white"
                            >
                                <option value="student">Student</option>
                                <option value="organizer">Organizer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {role === 'student' && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="col-span-2">
                                <label className="block text-kle-maroon font-bold mb-1 text-sm">Student Details</label>
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1 text-xs">USN</label>
                                <input
                                    type="text"
                                    value={usn}
                                    onChange={(e) => setUsn(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-kle-maroon text-sm"
                                    placeholder="2BK..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1 text-xs">Semester</label>
                                <input
                                    type="number"
                                    value={sem}
                                    onChange={(e) => setSem(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-kle-maroon text-sm"
                                    placeholder="1-8"
                                    required
                                    min="1"
                                    max="8"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-kle-gold text-kle-dark py-3 rounded-lg hover:bg-yellow-500 transition font-bold text-lg shadow-md transform active:scale-95 duration-150 mt-2"
                    >
                        Create Account
                    </button>
                </form>
                <div className="mt-6 text-center border-t border-gray-100 pt-4">
                    <p className="text-gray-600">Already have an account? <Link to="/login" className="text-kle-maroon font-bold hover:underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
