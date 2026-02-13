import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar, ViewToggle, Modal } from '../../components/AdminComponents';
import Loader from '../../components/Loader';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [view, setView] = useState('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({ 
        name: '', title: '', description: '', points: [''], image: '', rate: '' 
    });
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/services`);
            setServices(res.data);
            setFilteredServices(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = services.filter(service => 
            service.title.toLowerCase().includes(lowerTerm) || 
            service.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredServices(filtered);
    }, [searchTerm, services]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Point Handlers
    const handlePointChange = (index, value) => {
        const newPoints = [...formData.points];
        newPoints[index] = value;
        setFormData({ ...formData, points: newPoints });
    };

    const addPoint = () => {
        setFormData({ ...formData, points: [...formData.points, ''] });
    };

    const removePoint = (index) => {
        const newPoints = formData.points.filter((_, i) => i !== index);
        setFormData({ ...formData, points: newPoints });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imageFile: file });
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const openCreateModal = () => {
        setFormData({ name: '', title: '', description: '', points: [''], image: '', rate: '' });
        setPreview(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setFormData({
            name: service.name,
            title: service.title,
            description: service.description || '',
            points: service.points && service.points.length > 0 ? service.points : [''],
            image: service.image,
            rate: service.rate
        });
        setPreview(service.image);
        setIsEditing(true);
        setCurrentId(service._id);
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
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('rate', formData.rate);
        
        // Handle points array
        formData.points.forEach(point => {
            if (point.trim() !== '') {
                data.append('points', point.trim());
            }
        });

        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        } else if (formData.image) {
             data.append('image', formData.image); 
        }

        try {
            if (isEditing) {
                await axios.put(`${process.env.REACT_APP_API_URL}/services/${currentId}`, data, config);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/services`, data, config);
            }
            fetchServices();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Error saving service';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/services/${id}`, config);
            fetchServices();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <ViewToggle view={view} setView={setView} />
                    <button 
                        onClick={openCreateModal}
                        className="bg-[#002D5B] text-white px-4 py-2 rounded hover:bg-[#001f3f] transition"
                    >
                        + Add New
                    </button>
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <div key={service._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                            <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded mb-3" />
                            <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                            <p className="text-sm text-gray-600 mb-2 truncate">{service.description}</p>
                            <p className="font-semibold text-[#8B0000]">Rate: ₹{service.rate}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <button onClick={() => openEditModal(service)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Edit</button>
                                <button onClick={() => handleDelete(service._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredServices.map(service => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={service.image} alt="" className="h-10 w-10 rounded object-cover" />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">₹{service.rate}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(service)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">Delete</button>
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
                title={isEditing ? "Edit Service" : "Add New Service"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Internal Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full border p-2 rounded" required />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Display Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full border p-2 rounded" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Service Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*"
                                onChange={handleFileChange} 
                                className="mt-1 w-full border p-2 rounded" 
                            />
                            {preview && (
                                <div className="mt-2 text-center">
                                    <img src={preview} alt="Preview" className="h-24 mx-auto rounded object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Rate (₹)</label>
                            <input name="rate" type="number" value={formData.rate} onChange={handleChange} className="mt-1 w-full border p-2 rounded" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 w-full border p-2 rounded" rows="3" />
                        </div>
                        
                        {/* Dynamic Bullet Points */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                            {formData.points.map((point, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={point} 
                                        onChange={(e) => handlePointChange(index, e.target.value)} 
                                        className="w-full border p-2 rounded" 
                                        placeholder={`Point ${index + 1}`}
                                    />
                                    {formData.points.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removePoint(index)} 
                                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                            title="Remove Point"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={addPoint} 
                                className="mt-2 text-sm text-[#002D5B] hover:underline flex items-center gap-1 font-medium"
                            >
                                + Add another point
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-white rounded transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServicesManager;
