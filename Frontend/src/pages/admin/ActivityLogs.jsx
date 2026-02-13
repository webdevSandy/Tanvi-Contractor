import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/activity-logs?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const formatDetails = (action, details) => {
        if (!details) return '-';
        
        switch (action) {
            case 'LOGIN':
                return (
                    <span>
                        Logged in using <span className="font-semibold">{details.method}</span>
                    </span>
                );
            case 'CREATE_INVOICE':
                return (
                    <span>
                        Created Invoice <span className="font-semibold text-blue-600">#{details.invoiceNumber}</span>
                    </span>
                );
            case 'UPDATE_INVOICE':
                return (
                    <span>
                        Updated Invoice <span className="font-semibold text-blue-600">#{details.invoiceNumber}</span>
                    </span>
                );
             case 'DELETE_INVOICE':
                return (
                    <span>
                        Deleted Invoice <span className="font-semibold text-red-600">#{details.invoiceNumber}</span>
                    </span>
                );
             case 'CREATE_PARTNER':
                return (
                    <span>
                        Added Partner <span className="font-semibold text-indigo-600">{details.partnerName}</span>
                    </span>
                );
            case 'UPDATE_PARTNER':
                return (
                    <span>
                        Updated Partner <span className="font-semibold text-indigo-600">{details.partnerName}</span>
                    </span>
                );
            case 'DELETE_PARTNER':
                return (
                    <span>
                        Removed Partner <span className="font-semibold text-red-600">{details.partnerName}</span>
                    </span>
                );
            default:
                return JSON.stringify(details);
        }
    };

    const getActionIcon = (action) => {
        if (action.includes('LOGIN')) return <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;
        if (action.includes('CREATE')) return <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
        if (action.includes('UPDATE')) return <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
        if (action.includes('DELETE')) return <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
        return <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                     <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D5B] tracking-tight">Activity Log</h1>
                     <p className="text-gray-500 mt-1 text-sm">Track all system activities and user actions.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <svg className="w-2 h-2 mr-1.5 fill-current animate-pulse" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                        Live Tracking
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-[#f8fafc] hidden sm:table-header-group">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 flex justify-center">
                                        <Loader />
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                                 <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <p className="text-gray-500 font-medium">No activity logs found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 flex flex-col sm:table-row p-4 sm:p-0 border-b sm:border-b-0 relative">
                                        <td className="sm:px-6 sm:py-4 whitespace-nowrap mb-2 sm:mb-0">
                                            <div className="text-sm font-medium text-gray-900 inline-block sm:block">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-400 inline-block sm:block ml-2 sm:ml-0">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 whitespace-nowrap mb-2 sm:mb-0">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                                                     {log.user?.profileImage ? (
                                                         <img 
                                                             src={log.user.profileImage} 
                                                             alt={log.username} 
                                                             className="h-full w-full object-cover"
                                                         />
                                                     ) : (
                                                         <div className="h-full w-full bg-gradient-to-tr from-[#002D5B] to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                             {(log.username || 'S').charAt(0).toUpperCase()}
                                                         </div>
                                                     )}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 capitalize">{log.username || 'System'}</div>
                                                    <div className="text-xs text-gray-500 hidden sm:block">{log.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 whitespace-nowrap mb-2 sm:mb-0">
                                            <div className="flex items-center">
                                                <div className={`mr-2 p-1.5 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-100 group-hover:shadow-sm transition-all`}>
                                                    {getActionIcon(log.action)}
                                                </div>
                                                <span className={`text-xs font-bold tracking-wide 
                                                    ${log.action.includes('DELETE') ? 'text-red-700' : 
                                                      log.action.includes('CREATE') ? 'text-blue-700' : 
                                                      log.action.includes('UPDATE') ? 'text-amber-700' : 
                                                      'text-green-700'}`}>
                                                    {log.action.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 text-sm text-gray-600 mb-2 sm:mb-0">
                                            {formatDetails(log.action, log.details)}
                                        </td>
                                        <td className="sm:px-6 sm:py-4 whitespace-nowrap text-right text-xs font-mono text-gray-400 absolute top-4 right-4 sm:static">
                                            {log.ipAddress || '::1'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button onClick={handlePrev} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                            Previous
                        </button>
                        <button onClick={handleNext} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Showing page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                                <button onClick={handlePrev} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:bg-gray-50 transition-colors">
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={handleNext} disabled={page === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:bg-gray-50 transition-colors">
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
