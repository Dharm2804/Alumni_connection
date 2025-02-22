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
  profileImage?: string; // Will store base64 string
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
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
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
      if (!formData.engineeringType || !formData.passoutYear || !formData.companyName || !formData.companyLocation || !formData.profileImage) {
        setError('Please fill in all required alumni fields, including profile image.');
        return;
      }
    }

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        setSignupSuccess(true);
        setError('');
        setTimeout(() => {
          setSignupSuccess(false);
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Signup Failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Something went wrong!');
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsSiEjsa365-VnUxVBrw5NVvlBDA9hqSsr1szAgwM-LHpxwO9NoLcA6AAZVQtdgcBb-xw&usqp=CAU')" }}
    >
      {signupSuccess && (
        <motion.div
          className="absolute bg-green-500 text-white px-6 py-3 rounded-md shadow-lg text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Signup Successful! 🎉
        </motion.div>
      )}

      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md backdrop-blur-md bg-opacity-80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://admission.charusat.ac.in/View%20Assets/images/University_Hero.png"
          alt="Logo"
          className="mx-auto mb-4 w-32"
        />
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="flex justify-around mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="alumni"
                checked={formData.role === 'alumni'}
                onChange={handleRoleChange}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Alumni</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleRoleChange}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Student</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="faculty"
                checked={formData.role === 'faculty'}
                onChange={handleRoleChange}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Faculty</span>
            </label>
          </div>

          {formData.role === 'alumni' && (
            <div className="mb-4">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formData.profileImage && (
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover mb-4 mx-auto"
                  onError={() => setError('Error loading image preview')}
                />
              )}
              <input
                type="text"
                placeholder="Engineering Type"
                id="engineeringType"
                value={formData.engineeringType || ''}
                onChange={handleChange}
                required
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Passout Year"
                id="passoutYear"
                value={formData.passoutYear || ''}
                onChange={handleChange}
                required
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Company Name"
                id="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                required
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Company Location"
                id="companyLocation"
                value={formData.companyLocation || ''}
                onChange={handleChange}
                required
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="LinkedIn (optional)"
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
            Already have an account? Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}