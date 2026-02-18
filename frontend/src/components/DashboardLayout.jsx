import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardLayout = ({ children, title, role, sidebarItems, activeTab, setActiveTab }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white text-kle-dark border-r border-gray-200 transition-all duration-300 ease-in-out relative flex flex-col shadow-sm`}
            >
                {/* Collapse Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 bg-white text-kle-dark border border-gray-200 p-1 rounded-full shadow-md hover:bg-gray-50 transition z-10"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-kle-maroon flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                        {role.charAt(0).toUpperCase()}
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-lg whitespace-nowrap text-kle-maroon">{title}</h2>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">{role} Portal</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item, index) => {
                        const isActive = activeTab ? activeTab === item.id : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

                        // If setActiveTab is provided, treat sidebar items as tabs
                        if (setActiveTab && item.id) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-kle-maroon text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-kle-maroon'
                                        }`}
                                    title={!isSidebarOpen ? item.label : ''}
                                >
                                    <div className={`${isActive ? 'text-kle-gold' : 'text-gray-400 group-hover:text-kle-maroon'}`}>
                                        {item.icon}
                                    </div>
                                    {isSidebarOpen && (
                                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                                    )}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-kle-maroon text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-kle-maroon'
                                    }`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <div className={`${isActive ? 'text-kle-gold' : 'text-gray-400 group-hover:text-kle-maroon'}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && (
                                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-kle-maroon transition-colors"
                        title={!isSidebarOpen ? 'Back to Home' : ''}
                    >
                        <Home size={20} />
                        {isSidebarOpen && <span>Back to Home</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
