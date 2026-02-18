import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const EventCard = ({ event }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(event.date) - +new Date();
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [event.date]);

    const isExpired = +new Date(event.date) < +new Date();

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'student') {
            alert('Only students can register for events.');
            return;
        }

        if (window.confirm(`Do you want to register for ${event.title}?`)) {
            setRegistering(true);
            try {
                await api.post(`/register/${event.id}`);
                alert('Registration successful!');
                navigate('/student'); // Redirect to dashboard to see registration
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Registration failed');
            } finally {
                setRegistering(false);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                </div>

                {!isExpired ? (
                    <div className="bg-indigo-50 p-3 rounded-md mb-4">
                        <div className="flex items-center text-indigo-700 font-semibold text-sm mb-1">
                            <Clock className="w-4 h-4 mr-2" />
                            Countdown
                        </div>
                        <div className="flex justify-between text-center text-gray-700 text-sm">
                            <div><span className="block font-bold text-lg">{timeLeft.days || 0}</span>d</div>
                            <div><span className="block font-bold text-lg">{timeLeft.hours || 0}</span>h</div>
                            <div><span className="block font-bold text-lg">{timeLeft.minutes || 0}</span>m</div>
                            <div><span className="block font-bold text-lg">{timeLeft.seconds || 0}</span>s</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 text-red-600 p-2 rounded-md mb-4 text-center font-medium">
                        Event Ended
                    </div>
                )}

                {user ? (
                    <button
                        onClick={handleRegister}
                        disabled={isExpired || registering || user.role !== 'student'}
                        className={`block w-full text-center py-2 rounded-md font-semibold transition ${isExpired || user.role !== 'student'
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                    >
                        {isExpired ? "Closed" : registering ? "Registering..." : user.role === 'student' ? "Register Now" : "View Only (Role: " + user.role + ")"}
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className={`block w-full text-center py-2 rounded-md font-semibold transition ${isExpired
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                    >
                        {isExpired ? "Closed" : "Login to Register"}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default EventCard;
