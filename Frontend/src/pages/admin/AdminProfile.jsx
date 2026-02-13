import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../../components/AdminComponents';
import Loader from '../../components/Loader';

const AdminProfile = ({ isOpen, onClose }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
            setMessage('');
            setError('');
            setIsEditing(false);
            setPreviewImage(null);
        }
    }, [isOpen]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setFormData({ 
                username: res.data.username, 
                email: res.data.email || '', 
                password: '',
                profileImage: null 
            });
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        if (formData.password) data.append('password', formData.password);
        if (formData.profileImage instanceof File) {
            data.append('profileImage', formData.profileImage);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(res.data); // Update local user state
            setIsEditing(false);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    const toggle2FA = async () => {
        const action = user.twoFactorEnabled ? 'disable' : 'enable';
        if (!window.confirm(`Are you sure you want to ${action} 2-Factor Authentication?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/toggle-2fa`, 
                { enable: !user.twoFactorEnabled }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser({ ...user, twoFactorEnabled: res.data.twoFactorEnabled });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to toggle 2FA');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Admin Profile & Security">
            {loading ? (
                <div className="p-6 flex justify-center"><Loader /></div>
            ) : !user ? (
                <div className="p-6 text-center text-red-500">
                    {error || 'Could not load profile.'}
                </div>
            ) : (
                <div className="p-1">
                    {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{message}</div>}
                    {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-700">Profile Details</h3>
                            <button 
                                onClick={() => setIsEditing(!isEditing)} 
                                className="text-sm text-[#002D5B] hover:underline"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border shrink-0">
                                {previewImage || user.profileImage ? (
                                    <img 
                                        src={previewImage || user.profileImage} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {isEditing && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Change Photo</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase">Username</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleChange} 
                                        className="mt-1 w-full border p-2 rounded text-sm" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="mt-1 w-full border p-2 rounded text-sm" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase">New Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className="mt-1 w-full border p-2 rounded text-sm" 
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-[#002D5B] text-white px-4 py-2 rounded text-sm hover:bg-[#001f3f]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold w-20 inline-block text-gray-600">Username:</span> {user.username}</p>
                                <p><span className="font-semibold w-20 inline-block text-gray-600">Role:</span> {user.role}</p>
                                <p><span className="font-semibold w-20 inline-block text-gray-600">Email:</span> {user.email || <span className="text-gray-400 italic">Not set</span>}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-700">Two-Factor Authentication</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    Secure your account with OTP.
                                </p>
                            </div>
                            <button 
                                onClick={toggle2FA}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                    user.twoFactorEnabled 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                        {user.twoFactorEnabled && (
                            <div className="mt-2 text-xs text-green-600 font-medium">
                                ✓ Enabled. OPTs sent to {user.email}
                            </div>
                        )}
                         {!user.email && !user.twoFactorEnabled && (
                            <div className="mt-2 text-xs text-yellow-600">
                                * Email required to enable 2FA.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AdminProfile;
