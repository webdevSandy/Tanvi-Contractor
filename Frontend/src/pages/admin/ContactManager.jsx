import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar, Modal } from '../../components/AdminComponents';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(res.data);
            setFilteredContacts(res.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredContacts(contacts.filter(contact => 
            contact.name.toLowerCase().includes(lowerTerm) ||
            contact.email.toLowerCase().includes(lowerTerm) ||
            (contact.mobile && contact.mobile.includes(lowerTerm)) // Filter by mobile
        ));
    }, [searchTerm, contacts]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchContacts();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleView = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 self-start md:self-auto">Queries & Responses</h2>
                <div className="w-full md:w-auto">
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Name, Email, or Mobile..." />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message Preview</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredContacts.map(contact => (
                            <tr key={contact._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(contact)}>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{contact.mobile || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{contact.message}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }} 
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {filteredContacts.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No queries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredContacts.map(contact => (
                    <div 
                        key={contact._id} 
                        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleView(contact)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-800">{contact.name}</h3>
                                <span className="text-xs text-gray-500">{new Date(contact.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }} 
                                className="text-red-600 hover:text-red-800 p-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                                <span className="mr-2">📱</span> {contact.mobile || '-'}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">✉️</span> <span className="truncate">{contact.email}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 line-clamp-2">
                            {contact.message}
                        </div>
                    </div>
                ))}
                
                {filteredContacts.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">No queries found.</div>
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Message Details"
            >
                {selectedContact && (
                    <div className="space-y-4">
                        <div className="flex flex-col text-sm text-gray-500 border-b pb-2">
                             <div className="flex justify-between mb-1">
                                <span><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</span>
                                <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                             </div>
                             {selectedContact.mobile && <div><strong>Mobile:</strong> {selectedContact.mobile}</div>}
                        </div>
                        <div className="py-4">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                             <button 
                                onClick={() => handleDelete(selectedContact._id)} 
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Delete Message
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ContactManager;
