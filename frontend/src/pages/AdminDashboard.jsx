import { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Edit, Users, X, LayoutDashboard, Calendar, UserCheck, Settings } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', venue: '', max_participants: '', registration_deadline: ''
    });

    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (activeTab === 'overview') fetchData();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const eventsRes = await api.get('/events');
            setEvents(eventsRes.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/dashboard/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users");
        }
    };

    const handleEdit = (event) => {
        try {
            const dateStr = event.date ? new Date(event.date).toISOString().slice(0, 16) : '';
            const deadlineStr = event.registration_deadline ? new Date(event.registration_deadline).toISOString().slice(0, 16) : '';

            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: dateStr,
                venue: event.venue || '',
                max_participants: event.max_participants || '',
                registration_deadline: deadlineStr
            });
            setEditId(event.id);
            setShowForm(true);
        } catch (error) {
            console.error("Error preparing edit form:", error);
            alert("Error loading event details for editing.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e.id !== id));
            } catch (error) {
                console.error('Failed to delete event');
            }
        }
    };

    const handleViewParticipants = async (eventId, eventTitle) => {
        setSelectedEventTitle(eventTitle);
        setShowParticipantsModal(true);
        setParticipants([]);
        try {
            const res = await api.get(`/register/event/${eventId}`);
            setParticipants(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch participants');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                max_participants: parseInt(formData.max_participants),
                date: formData.date.replace('T', ' ') + ':00',
                registration_deadline: formData.registration_deadline ? formData.registration_deadline.replace('T', ' ') + ':00' : null
            };

            if (editId) {
                await api.put(`/events/${editId}`, payload);
                alert('Event updated successfully');
            } else {
                await api.post('/events', payload);
                alert('Event created successfully');
            }

            setEditId(null);
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', venue: '', max_participants: '', registration_deadline: '' });
            fetchData();
        } catch (error) {
            console.error('Failed to save event', error);
            alert(`Failed to save event: ${error.response?.data?.message || error.message}`);
        }
    };

    const sidebarItems = [
        { label: 'Overview', id: 'overview', icon: <LayoutDashboard size={20} /> },
        { label: 'Events', id: 'events', icon: <Calendar size={20} /> },
        { label: 'Users', id: 'users', icon: <Users size={20} /> },
        { label: 'Settings', id: 'settings', icon: <Settings size={20} /> },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-kle-maroon"></div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                        <h2 className="text-2xl font-bold text-kle-dark mb-6 border-b pb-2">Registered Users</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">USN</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.usn || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in max-w-2xl">
                        <h2 className="text-2xl font-bold text-kle-dark mb-6 border-b pb-2">System Settings</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portal Name</label>
                                <input type="text" defaultValue="KLE-BK Connect - Event Portal" className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Contact Email</label>
                                <input type="email" defaultValue="admin@kle.edu.in" className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option>2025-2026</option>
                                    <option>2024-2025</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="maintenance" className="rounded text-kle-maroon" />
                                <label htmlFor="maintenance" className="text-sm text-gray-700">Enable Maintenance Mode</label>
                            </div>
                            <button type="button" className="px-4 py-2 bg-kle-maroon text-white rounded-md hover:bg-red-900 transition">Save Settings</button>
                        </form>
                    </div>
                );
            case 'events':
            case 'overview':
            default:
                return (
                    <>
                        {/* Quick Actions Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditId(null);
                                    setFormData({ title: '', description: '', date: '', venue: '', max_participants: '', registration_deadline: '' });
                                }}
                                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-kle-maroon hover:shadow-lg transition text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-3 bg-red-50 rounded-full group-hover:bg-kle-maroon group-hover:text-white transition-colors">
                                        <Edit size={24} className="text-kle-maroon group-hover:text-white" />
                                    </div>
                                    <span className="text-4xl font-light text-gray-200 group-hover:text-kle-maroon/20 transition-colors">01</span>
                                </div>
                                <h3 className="text-lg font-bold text-kle-dark group-hover:text-kle-maroon">Create Event</h3>
                                <p className="text-sm text-gray-500 mt-1">Schedule a new campus event.</p>
                            </button>

                            <button onClick={() => setActiveTab('users')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-kle-gold hover:shadow-lg transition text-left group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-3 bg-yellow-50 rounded-full group-hover:bg-kle-gold group-hover:text-white transition-colors">
                                        <Users size={24} className="text-kle-gold group-hover:text-white" />
                                    </div>
                                    <span className="text-4xl font-light text-gray-200 group-hover:text-kle-gold/20 transition-colors">02</span>
                                </div>
                                <h3 className="text-lg font-bold text-kle-dark group-hover:text-kle-gold">Manage Users</h3>
                                <p className="text-sm text-gray-500 mt-1">View and manage student records.</p>
                            </button>

                            <button onClick={() => setActiveTab('settings')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-kle-orange hover:shadow-lg transition text-left group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-3 bg-orange-50 rounded-full group-hover:bg-kle-orange group-hover:text-white transition-colors">
                                        <Settings size={24} className="text-kle-orange group-hover:text-white" />
                                    </div>
                                    <span className="text-4xl font-light text-gray-200 group-hover:text-kle-orange/20 transition-colors">03</span>
                                </div>
                                <h3 className="text-lg font-bold text-kle-dark group-hover:text-kle-orange">System Settings</h3>
                                <p className="text-sm text-gray-500 mt-1">Configure portal preferences.</p>
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg relative">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-bold text-kle-dark">Upcoming Events</h2>
                                {showForm && (
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="text-gray-500 hover:text-red-500 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {showForm && (
                                <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in">
                                    <h3 className="font-bold text-kle-maroon">{editId ? 'Edit Event' : 'New Event Details'}</h3>
                                    <input
                                        placeholder="Event Title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none transition"
                                        required
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none transition"
                                        required
                                        rows="3"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Event Date</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Deadline</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.registration_deadline}
                                                onChange={e => setFormData({ ...formData, registration_deadline: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Venue"
                                            value={formData.venue}
                                            onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Participants"
                                            value={formData.max_participants}
                                            onChange={e => setFormData({ ...formData, max_participants: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-kle-gold focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" className="flex-1 bg-kle-maroon text-white py-3 rounded-lg hover:bg-red-900 font-semibold shadow-md transition">
                                            {editId ? 'Update Event' : 'Publish Event'}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                {events.map(event => (
                                    <div key={event.id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition group">
                                        <div>
                                            <h4 className="font-bold text-kle-dark group-hover:text-kle-maroon transition-colors">{event.title}</h4>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(event.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewParticipants(event.id, event.title)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                                                title="View Participants"
                                            >
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                                                title="Edit Event"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                                title="Delete Event"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <DashboardLayout
            title="Admin Dashboard"
            role="admin"
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-kle-dark mb-2">Welcome Back, Admin</h1>
                <p className="text-gray-500">Here's what's happening across the campus today.</p>
            </div>

            {renderContent()}

            {
                showParticipantsModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative border-t-4 border-kle-gold">
                            <button
                                onClick={() => setShowParticipantsModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-1 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-kle-maroon">Participants</h2>
                                <p className="text-gray-500 text-sm">Event: <span className="font-semibold text-gray-800">{selectedEventTitle}</span></p>
                            </div>

                            {participants.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No participants registered yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto max-h-[500px] border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">USN</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sem</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {participants.map((p, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.user_name || p.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.user_email || p.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.user_usn || p.usn || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.user_sem || p.sem || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'attended' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </DashboardLayout >
    );
};

export default AdminDashboard;
