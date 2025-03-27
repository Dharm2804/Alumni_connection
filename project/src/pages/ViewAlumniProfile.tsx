import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface EmploymentHistory {
  companyName: string;
  role: string;
  companyLocation: string;
  durationFrom: string;
  durationTo: string | null;
}

interface AlumniProfile {
  _id: string;
  name: string;
  profileImage: string;
  engineeringType: string;
  passoutYear: string;
  email: string;
  linkedin: string;
  employmentHistory: EmploymentHistory[];
}

export default function ViewAlumniProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/view_alumni_profile/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleBack = () => {
    navigate('/alumni');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-2xl mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Directory
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Alumni Profile</h1>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {profile.profileImage && (
                <img src={profile.profileImage} alt="Profile" className="w-24 h-24 rounded-full" />
              )}
              <div>
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-500 text-sm">Engineering Type</h3>
                <p className="font-medium">{profile.engineeringType}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Passout Year</h3>
                <p className="font-medium">{profile.passoutYear}</p>
              </div>
            </div>

            {profile.linkedin && (
              <div>
                <h3 className="text-gray-500 text-sm">LinkedIn</h3>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {profile.linkedin}
                </a>
              </div>
            )}

            {/* Employment History */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Employment History</h2>
              <div className="space-y-4">
                {profile.employmentHistory.map((emp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">{emp.companyName}</h3>
                    <p className="text-gray-600">{emp.role}</p>
                    <p className="text-gray-500">{emp.companyLocation}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(emp.durationFrom).toLocaleDateString()} - 
                      {emp.durationTo ? new Date(emp.durationTo).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 