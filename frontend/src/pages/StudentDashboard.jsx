import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Download, CheckCircle, XCircle, LayoutDashboard, FileText, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('registrations');

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await api.get('/register/my-events');
                setRegistrations(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const handleDownloadCertificate = async (eventId) => {
        alert('Certificate download started for event ' + eventId);
    };

    const sidebarItems = [
        { id: 'registrations', label: 'My Registrations', icon: <LayoutDashboard size={20} /> },
        { id: 'certificates', label: 'Certificates', icon: <FileText size={20} /> },
        { label: 'Upcoming Events', path: '/', icon: <Calendar size={20} /> },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-kle-maroon"></div>
        </div>
    );

    return (
        <DashboardLayout title="Student Portal" role="student" sidebarItems={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-kle-dark mb-2">Hello, {user?.name}</h1>
                <p className="text-gray-500">Track your event participation and achievements.</p>
            </div>

            {activeTab === 'registrations' && (
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-kle-gold overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-kle-maroon flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Registered Events
                        </h2>
                    </div>

                    {registrations.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No Registrations Yet</h3>
                            <p className="text-gray-500">Browse upcoming events and register to participate.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Venue</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-kle-dark">{reg.title}</div>
                                                <div className="text-xs text-gray-500">ID: {reg.event_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{new Date(reg.date).toLocaleDateString()}</div>
                                                <div className="text-sm text-gray-500">{reg.venue}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'attended'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : reg.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    }`}>
                                                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {reg.status === 'attended' ? (
                                                    <button
                                                        onClick={() => handleDownloadCertificate(reg.event_id)}
                                                        className="inline-flex items-center gap-1 bg-kle-maroon text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-900 transition shadow-sm"
                                                    >
                                                        <Download className="w-3.5 h-3.5" /> Certificate
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Certificate locked</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'certificates' && (
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-kle-gold overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-kle-maroon flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            My Certificates
                        </h2>
                    </div>

                    {registrations.filter(r => r.status === 'attended').length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No Certificates Available</h3>
                            <p className="text-gray-500">Attend events to earn certificates.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {registrations.filter(r => r.status === 'attended').map(reg => (
                                <div key={reg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-white rounded-full border border-gray-100">
                                            <CheckCircle className="text-green-500 w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">{new Date(reg.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{reg.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{reg.venue}</p>
                                    <button
                                        onClick={() => handleDownloadCertificate(reg.event_id)}
                                        className="w-full flex items-center justify-center gap-2 bg-kle-maroon text-white py-2 rounded-lg hover:bg-red-900 transition text-sm font-medium"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
