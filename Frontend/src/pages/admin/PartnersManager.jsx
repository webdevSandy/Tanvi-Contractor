import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar, ViewToggle, Modal } from '../../components/AdminComponents';

const PartnersManager = () => {
    const [partners, setPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [view, setView] = useState('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({ name: '', logo: '' });
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const fetchPartners = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/partners`);
            setPartners(res.data);
            setFilteredPartners(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredPartners(partners.filter(p => p.name.toLowerCase().includes(lowerTerm)));
    }, [searchTerm, partners]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imageFile: file });
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const openCreateModal = () => {
        setFormData({ name: '', logo: '' });
        setPreview(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (partner) => {
        setFormData({ name: partner.name, logo: partner.logo });
        setPreview(partner.logo);
        setIsEditing(true);
        setCurrentId(partner._id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const config = { 
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            } 
        };

        const data = new FormData();
        data.append('name', formData.name);
        if (formData.imageFile) {
            data.append('image', formData.imageFile); // 'image' field expected by middleware
        } else if (formData.logo) {
            data.append('logo', formData.logo);
        }

        try {
            if (isEditing) {
                await axios.put(`${process.env.REACT_APP_API_URL}/partners/${currentId}`, data, config);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/partners`, data, config);
            }
            fetchPartners();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error saving partner');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/partners/${id}`, config);
            fetchPartners();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 self-start md:self-auto">Manage Partners</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <ViewToggle view={view} setView={setView} />
                        <button 
                            onClick={openCreateModal}
                            className="bg-[#002D5B] text-white px-4 py-2 rounded hover:bg-[#001f3f] transition whitespace-nowrap ml-2"
                        >
                            + Add New
                        </button>
                    </div>
                </div>
            </div>

            {view === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredPartners.map(partner => (
                        <div key={partner._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
                            <div className="h-24 w-full flex items-center justify-center mb-3 bg-gray-50 rounded">
                                <img src={partner.logo} alt={partner.name} className="max-h-20 max-w-full object-contain" />
                            </div>
                            <h3 className="font-bold text-center mb-3">{partner.name}</h3>
                            <div className="flex justify-between items-center w-full mt-3">
                                <button onClick={() => openEditModal(partner)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Edit</button>
                                <button onClick={() => handleDelete(partner._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPartners.map(partner => (
                                <tr key={partner._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={partner.logo} alt="" className="h-10 w-auto object-contain" />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{partner.name}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(partner)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(partner._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={isEditing ? "Edit Partner" : "Add New Partner"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Partner Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Logo Image</label>
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*"
                            onChange={handleFileChange} 
                            className="mt-1 w-full border p-2 rounded" 
                        />
                        {preview && (
                            <div className="mt-2 text-center">
                                <img src={preview} alt="Preview" className="h-16 mx-auto object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-white rounded transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Partner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PartnersManager;
