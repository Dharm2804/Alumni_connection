import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  engineeringType?: string;
  passoutYear?: number;
  companyName?: string;
  companyLocation?: string;
  linkedin?: string;
  profileImage?: string; // Base64 string
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    engineeringType: '',
    passoutYear: undefined,
    companyName: '',
    companyLocation: '',
    linkedin: '',
    profileImage: '',
  });

  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'passoutYear' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string, // Base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!formData.role) {
      setError('Please select a role.');
      return;
    }
  
    if (formData.role === 'alumni') {
      if (!formData.engineeringType || !formData.passoutYear || 
          !formData.companyName || !formData.companyLocation) {
        setError('Please fill in all required alumni fields.');
        return;
      }
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        setSignupSuccess(true);
        setError('');
        setTimeout(() => {
          setSignupSuccess(false);
          setIsLoading(false);
          navigate('/verify-otp', { 
            state: { 
              email: formData.email,
              role: formData.role 
            } 
          });
        }, 2000);
      } else {
        // Display the specific error message from the backend
        setError(data.message || 'Signup Failed!');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Something went wrong! Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      {signupSuccess && (
        <motion.div
          className="absolute top-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Signup Successful! 🎉
        </motion.div>
      )}

      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://admission.charusat.ac.in/View%20Assets/images/University_Hero.png"
          alt="Logo"
          className="mx-auto mb-6 w-32"
        />
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account</h2>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded-md">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ... (previous form fields remain unchanged) ... */}

          <div>
            <input
              type="text"
              placeholder="Full Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>

          <div className="flex justify-between items-center px-2">
            {['alumni', 'student', 'faculty'].map((r) => (
              <label key={r} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={formData.role === r}
                  onChange={handleRoleChange}
                  className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 capitalize">{r}</span>
              </label>
            ))}
          </div>

          {formData.role === 'alumni' && (
            <div className="space-y-5">
              {/* ... (alumni fields remain unchanged) ... */}
              <div>
                <label htmlFor="profileImage" className="text-gray-700">Profile Image</label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover mt-3 mx-auto"
                    onError={() => setError('Error loading image preview')}
                  />
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Engineering Type"
                  id="engineeringType"
                  value={formData.engineeringType || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Passout Year"
                  id="passoutYear"
                  value={formData.passoutYear || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company Name"
                  id="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company Location"
                  id="companyLocation"
                  value={formData.companyLocation || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="LinkedIn (optional)"
                  id="linkedin"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-white
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}