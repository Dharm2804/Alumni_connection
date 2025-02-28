import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);

      setLoginSuccess(true);

      setTimeout(() => {
        setLoginSuccess(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message || 'Invalid credentials');
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsSiEjsa365-VnUxVBrw5NVvlBDA9hqSsr1szAgwM-LHpxwO9NoLcA6AAZVQtdgcBb-xw&usqp=CAU')" }}>
      {loginSuccess && (
        <motion.div
          className="absolute bg-green-500 text-white px-6 py-3 rounded-md shadow-lg text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Login Successful! 🎉
        </motion.div>
      )}

      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md backdrop-blur-md bg-opacity-80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Login</h2>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mb-4 p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />

          <div className="flex justify-around mb-4">
            <label className="flex items-center">
              <input type="radio" name="role" value="alumni" checked={role === 'alumni'} onChange={(e) => setRole(e.target.value)} className="form-radio h-4 w-4 text-indigo-600" />
              <span className="ml-2">Alumni</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" value="student" checked={role === 'student'} onChange={(e) => setRole(e.target.value)} className="form-radio h-4 w-4 text-indigo-600" />
              <span className="ml-2">Student</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" value="faculty" checked={role === 'faculty'} onChange={(e) => setRole(e.target.value)} className="form-radio h-4 w-4 text-indigo-600" />
              <span className="ml-2">Faculty</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Login</button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/forgot-password')} className="text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/signup')} className="text-indigo-600 hover:text-indigo-700">Don't have an account? Sign Up</button>
        </div>
      </motion.div>
    </div>
  );
}
