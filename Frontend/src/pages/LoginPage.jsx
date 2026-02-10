import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.twoFactorRequired) {
            setStep('otp');
            setUserId(data.userId);
            setTimer(120); // Reset timer
            setMessage(data.message || 'Please enter the OTP sent to your email.');
        } else {
            // Normal Login Success
            localStorage.setItem('token', data.token);
            navigate('/admin/dashboard'); 
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            navigate('/admin/dashboard');
        } else {
            setError(data.message || 'Invalid OTP');
        }
    } catch (err) {
        setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#002D5B]">
            {step === 'login' ? 'Admin Login' : 'Enter OTP'}
        </h2>
        
        {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm whitespace-pre-line">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        {step === 'login' ? (
            <form onSubmit={handleLogin}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B]"
                required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B]"
                required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                    isLoading 
                        ? 'bg-gray-400 cursor-not-allowed text-gray-800' 
                        : 'bg-[#002D5B] text-white hover:bg-[#001f3f]'
                }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                    </span>
                ) : 'Sign In'}
            </button>
            </form>
        ) : (
            <form onSubmit={handleVerifyOtp}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">One-Time Password</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B] text-center tracking-widest text-xl"
                        placeholder="123456"
                        required
                    />
                </div>
                
                <div className="mb-6 text-center">
                    <div className={`text-lg font-mono font-bold ${timer < 30 ? 'text-red-600' : 'text-gray-600'}`}>
                        {formatTime(timer)}
                    </div>
                    <p className="text-xs text-gray-500">Time remaining to verify code</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#002D5B] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#001f3f] transition-colors"
                >
                    Verify OTP
                </button>
                <button
                    type="button"
                    onClick={() => { setStep('login'); setMessage(''); setError(''); setUsername(''); setPassword(''); }}
                    className="block w-full text-center mt-4 text-sm text-gray-600 hover:text-[#002D5B] hover:underline"
                >
                    Back to Login
                </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
