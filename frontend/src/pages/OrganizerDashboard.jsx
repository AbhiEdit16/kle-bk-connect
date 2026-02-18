import { useState, useEffect } from 'react';
import api from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import { LayoutDashboard, Calendar, QrCode, ArrowLeft, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleSelectEvent = async (event) => {
        setSelectedEvent(event);
        try {
            const res = await api.get(`/register/event/${event.id}`);
            setRegistrations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const markAttendance = async (registrationId) => {
        try {
            await api.put(`/register/attendance/${registrationId}`, { status: 'attended' });
            setRegistrations(prev => prev.map(reg => reg.id === registrationId ? { ...reg, status: 'attended' } : reg));
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    const sidebarItems = [
        { id: 'events', label: 'My Events', icon: <LayoutDashboard size={20} /> },
        { id: 'scan', label: 'Scan QR', icon: <QrCode size={20} /> },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-kle-maroon"></div>
        </div>
    );

    return (
        <DashboardLayout title="Organizer Portal" role="organizer" sidebarItems={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-kle-dark mb-2">Event Management</h1>
                <p className="text-gray-500">Manage attendance and view participant details.</p>
            </div>

            {activeTab === 'events' && (
                <>
                    {!selectedEvent ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-kle-maroon group"
                                    onClick={() => handleSelectEvent(event)}
                                >
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-kle-maroon transition-colors">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                                        <Calendar size={16} className="text-kle-gold" />
                                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                            {event.max_participants} Seats
                                        </span>
                                        <span className="text-kle-maroon font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Manage &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-kle-maroon transition font-medium"
                            >
                                <ArrowLeft size={18} /> Back to Events
                            </button>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Participants List */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-4 text-kle-dark border-b pb-2">
                                        Attendance: <span className="text-kle-maroon">{selectedEvent.title}</span>
                                    </h2>

                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">USN</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sem</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {registrations.map(reg => (
                                                        <tr key={reg.id} className="hover:bg-gray-50 transition">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{reg.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{reg.usn || '-'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.sem || '-'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'attended'
                                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                    }`}>
                                                                    {reg.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                {reg.status !== 'attended' ? (
                                                                    <button
                                                                        onClick={() => markAttendance(reg.id)}
                                                                        className="text-kle-maroon hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition"
                                                                    >
                                                                        Mark Present
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-green-600 flex items-center gap-1">
                                                                        <CheckCircle size={14} /> Done
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {registrations.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                                No participants registered yet.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Section */}
                                <div className="w-full lg:w-80">
                                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-kle-gold sticky top-6">
                                        <h3 className="text-lg font-bold mb-4 text-center text-kle-dark">Event Check-in QR</h3>
                                        <div className="flex justify-center mb-4">
                                            <div className="p-2 border-2 border-dashed border-gray-300 rounded-lg">
                                                <QRCodeCanvas value={`https://campusconnect.com/events/${selectedEvent.id}`} size={200} />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-sm font-medium text-gray-900">{selectedEvent.title}</p>
                                            <p className="text-xs text-gray-500">Scan this code to verify student registration.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'scan' && (
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-kle-gold p-12 text-center animate-fade-in">
                    <div className="inline-block p-6 bg-gray-50 rounded-full mb-6">
                        <QrCode className="w-12 h-12 text-kle-maroon" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Use this feature to scan student QR codes for quick attendance marking.
                        Camera permission will be required.
                    </p>
                    <button className="bg-kle-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-red-900 transition shadow-md">
                        Start Camera
                    </button>
                    <p className="mt-4 text-xs text-gray-400">Feature coming soon.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default OrganizerDashboard;
