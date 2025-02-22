import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    profileImage: '',
    engineeringType: '',
    passoutYear: '',
    companyName: '',
    role: '',
    companyLocation: '',
    email: '',
    linkedin: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            email: email,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setMessage('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
        setMessage('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/update_profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          email: email,
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('Error updating profile');
    }
  };

  // Handle Back to Home with error handling
  const handleBackToHome = () => {
    try {
      const role = localStorage.getItem('role');
      if (!role) {
        throw new Error('No role found in localStorage');
      }
      navigate(role === 'alumni' ? '/' : '/');
    } catch (error) {
      console.error('Back to Home error:', error);
      setMessage('Error navigating back to home. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Alumni Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            {profile.profileImage && (
              <img src={profile.profileImage} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-600"
            />
          </div>
          <input
            type="text"
            name="engineeringType"
            value={profile.engineeringType}
            onChange={handleChange}
            placeholder="Engineering Type"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="passoutYear"
            value={profile.passoutYear}
            onChange={handleChange}
            placeholder="Passout Year"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="role"
            value={profile.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="companyLocation"
            value={profile.companyLocation}
            onChange={handleChange}
            placeholder="Company Location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn Profile"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg py-2 transition duration-300"
          >
            Update Profile
          </button>
        </form>
        <button
          onClick={handleBackToHome}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg py-2 transition duration-300"
        >
          Back to Home
        </button>
        {message && <div className="mt-4 text-center text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default Profile;