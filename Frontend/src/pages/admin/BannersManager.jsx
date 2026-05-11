import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar, ViewToggle, Modal } from '../../components/AdminComponents';
import Loader from '../../components/Loader';

const BannersManager = () => {
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [view, setView] = useState('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({ title: '', subtitle: '', image: '' });
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners`);
            setBanners(res.data);
            setFilteredBanners(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredBanners(banners.filter(b => b.title.toLowerCase().includes(lowerTerm)));
    }, [searchTerm, banners]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imageFile: file });
        if (file) {
            if (file.name.match(/\.(json|lottie)$/i) || file.type === 'application/json') {
                setPreview('LOTTIE_PREVIEW');
            } else {
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    const openCreateModal = () => {
        setFormData({ title: '', subtitle: '', image: '' });
        setPreview(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (banner) => {
        setFormData({ title: banner.title, subtitle: banner.subtitle || '', image: banner.image });
        setPreview(banner.image);
        setIsEditing(true);
        setCurrentId(banner._id);
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
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        } else if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (isEditing) {
                await axios.put(`${process.env.REACT_APP_API_URL}/banners/${currentId}`, data, config);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/banners`, data, config);
            }
            fetchBanners();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error saving banner');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/banners/${id}`, config);
            fetchBanners();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manage Banners</h2>
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
                    {filteredBanners.map(banner => (
                        <div key={banner._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                            {banner.image && banner.image.match(/\.(json|lottie)$/i) ? (
                                <div className="w-full h-40 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-500 font-medium text-sm">Lottie Animation</div>
                            ) : (
                                <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded mb-3" />
                            )}
                            <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{banner.subtitle}</p>
                            <div className="flex justify-between items-center mt-3">
                                <button onClick={() => openEditModal(banner)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Edit</button>
                                <button onClick={() => handleDelete(banner._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtitle</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBanners.map(banner => (
                                <tr key={banner._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {banner.image && banner.image.match(/\.(json|lottie)$/i) ? (
                                            <div className="h-12 w-20 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-500 font-medium">Lottie</div>
                                        ) : (
                                            <img src={banner.image} alt="" className="h-12 w-20 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{banner.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{banner.subtitle}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(banner)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(banner._id)} className="text-red-600 hover:text-red-900">Delete</button>
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
                title={isEditing ? "Edit Banner" : "Add New Banner"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                        <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Banner Image / Lottie (.json)</label>
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*,.json,.lottie,application/json"
                            onChange={handleFileChange} 
                            className="mt-1 w-full border p-2 rounded" 
                        />
                        {preview === 'LOTTIE_PREVIEW' ? (
                            <div className="mt-2 text-center p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 font-medium">
                                Lottie Animation Selected (Preview available on save)
                            </div>
                        ) : preview ? (
                            <div className="mt-2 text-center">
                                <img src={preview} alt="Preview" className="h-32 mx-auto rounded object-cover" />
                            </div>
                        ) : null}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-white rounded transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Banner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BannersManager;
