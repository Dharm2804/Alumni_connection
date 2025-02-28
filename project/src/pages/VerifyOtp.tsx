import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string>(''); // Explicitly typed as string
  const [error, setError] = useState<string>(''); // Explicitly typed as string
  const [success, setSuccess] = useState<boolean>(false); // Explicitly typed as boolean
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | undefined)?.email || ''; // Type assertion for location.state

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { // Typed FormEvent with HTMLFormElement
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      const response = await axios.post<{ token: string }>('http://localhost:5000/api/verify-otp', { email, otp }); // Typed response data
      setSuccess(true);
      setError('');
      localStorage.setItem('token', response.data.token); // Store token after verification
      setTimeout(() => {
        setSuccess(false);
        navigate('/login'); // Redirect to login after successful OTP verification
      }, 2000);
    } catch (error) {
      setSuccess(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Invalid OTP');
      } else {
        setError('Something went wrong');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/resend-otp', { email });
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000); // Briefly show success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Failed to resend OTP');
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      {success && (
        <motion.div
          className="absolute top-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          🎉 OTP Verified! Redirecting to login... 🎉
        </motion.div>
      )}

      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-6">
          An OTP has been sent to {email || 'your email'}
        </p>
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded-md">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Resend OTP
          </button>
        </div>
      </motion.div>
    </div>
  );
}