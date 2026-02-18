import { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { Calendar, Award, Users } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-kle-maroon"></div>
        </div>
    );

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-kle-maroon to-gray-900 rounded-2xl p-8 md:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Award size={400} />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                        Welcome to <span className="text-kle-gold">KLE-BK Connect</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                        The Official Event Management Portal of <br />
                        <span className="font-medium">Karnataka Lingayat Education Society | BK BCA College</span>
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#events" className="bg-kle-gold text-kle-dark px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition shadow-lg transform hover:-translate-y-1">
                            Explore Events
                        </a>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                            <Calendar className="text-kle-gold" />
                            <span className="font-medium">{events.length} Upcoming Events</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div id="events" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-2 bg-kle-gold rounded-full"></div>
                    <h2 className="text-3xl font-bold text-kle-dark">Upcoming Campus Activities</h2>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border-t-4 border-kle-maroon">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No Events Found</h3>
                        <p className="text-gray-500">Stay tuned! New events will be announced soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
