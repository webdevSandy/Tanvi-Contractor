import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

import AdminProfile from '../pages/admin/AdminProfile'; // Import modal component

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Default to closed on mobile (width < 768px), open on desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Modal state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings Dropdown state
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();

        const handleResize = () => {
             if (window.innerWidth < 768) {
                 setIsSidebarOpen(false);
             } else {
                 setIsSidebarOpen(true);
             }
        };

        // Optional: Listen for resize events to auto-adjust
         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
    }, [isProfileOpen]); // Re-fetch when modal closes to update avatar

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path 
            ? 'bg-[#8B0000] text-white' 
            : 'text-gray-300 hover:bg-[#8B0000] hover:text-white';
    };

    // Helper to render links with icons
    const NavLink = ({ to, icon, label }) => (
        <Link 
            to={to} 
            onClick={() => {
                if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                }
            }}
            className={`flex items-center px-4 py-3 rounded transition-colors mb-1 ${isActive(to)}`}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            <span className={`ml-4 duration-200 ${!isSidebarOpen ? 'md:opacity-0 md:w-0 md:overflow-hidden md:ml-0' : 'block'}`}>
                {label}
            </span>
        </Link>
    );

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative z-40 h-full
                bg-[#002D5B] text-white flex flex-col transition-all duration-300 shadow-xl
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
            `}>
                
                {/* Sidebar Header with Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 flex-shrink-0">
                    <h1 className={`font-bold text-xl whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'md:scale-0 md:w-0'} ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                        Tanvi Admin
                    </h1>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="hidden md:block p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none"
                    >
                        {/* Desktop Hamburger Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {/* Mobile Close Button */}
                     <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="md:hidden p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-2 py-6 overflow-y-auto overflow-x-hidden">
                    <NavLink 
                        to="/admin/dashboard" 
                        label="Dashboard"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                    />
                    <NavLink 
                        to="/admin/contacts" 
                        label="Queries"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                    />
                    <NavLink 
                        to="/admin/invoices" 
                        label="Invoices"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                    {/* Settings Dropdown */}
                    <div>
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`w-full flex items-center px-4 py-3 rounded transition-colors mb-1 text-gray-300 hover:bg-[#8B0000] hover:text-white justify-between`}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className={`ml-4 duration-200 ${!isSidebarOpen ? 'md:opacity-0 md:w-0 md:overflow-hidden md:ml-0' : 'block'}`}>
                                    Settings
                                </span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''} ${!isSidebarOpen && 'md:hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Items */}
                        <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="bg-[#001f3f] py-2">
                                <NavLink 
                                    to="/admin/services" 
                                    label="Services"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                />
                                <NavLink 
                                    to="/admin/partners" 
                                    label="Partners"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                />
                                <NavLink 
                                    to="/admin/banners" 
                                    label="Banners"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                />
                                <NavLink 
                                    to="/admin/about" 
                                    label="About Us"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                />
                                <NavLink 
                                    to="/admin/company-info" 
                                    label="Company Info"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                />
                                <NavLink 
                                    to="/admin/footer" 
                                    label="Footer"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                                />
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div className="p-4 border-t border-gray-700 space-y-2">
                     <NavLink 
                        to="/admin/activity-logs" 
                        label="Activity Logs"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'md:justify-center'} px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors`}
                    >
                         <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                         <span className={`ml-3 duration-200 ${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                {/* Top Navbar */}
                <header className="h-16 bg-white shadow flex items-center justify-between px-4 sm:px-6 z-10">
                    <div className="flex items-center">
                        {/* Mobile Hamburger - Only visible on small screens */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="mr-3 md:hidden p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                         {/* Toggle moved to sidebar, so only title here now */}
                        <Link to="/admin/dashboard" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center">
                            {(location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname.includes('/dashboard')) ? (
                                'Dashboard'
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    <span className="hidden sm:inline">Back to Dashboard</span>
                                </>
                            )}
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-3 hidden sm:flex flex gap-2 items-center">
                            <span className="text-s text-gray-500 font-medium">Welcome,</span>
                            <span className="text-gray-800 font-semibold text-normal">{user?.username || 'Admin'}</span>
                        </div>
                        <button 
                            onClick={() => setIsProfileOpen(true)}
                            className="h-10 w-10 bg-gray-200 rounded-full hover:ring-2 hover:ring-[#002D5B] transition-all cursor-pointer overflow-hidden flex items-center justify-center focus:outline-none border border-gray-300 shadow-sm"
                            title="View Profile"
                        >
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-sm text-gray-600 font-bold">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
                            )}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="ml-3 p-2 bg-[#8B0000] text-white rounded-lg hover:bg-red-800 transition-colors shadow-md flex items-center justify-center"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 w-full">
                    <Outlet />
                </main>
            </div>

            {/* Profile Modal */}
            <AdminProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default AdminLayout;
