import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface Invitation {
  _id: string;
  senderId: User;
  receiverId: User;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Alumni {
  _id: string;
  name: string;
  email: string;
}

const Invitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [role, setRole] = useState<string>('');
  const [receiverEmail, setReceiverEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [email,setemail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem('userEmail') || '';
      
      // Fetch user role
      const roleResponse = await axios.get('http://localhost:5000/api/current-user', {
        headers: { email: localStorage.getItem('email') },
          withCredentials: true,
      });
      setRole(roleResponse.data.role || '');
      console.log(roleResponse);
      

      // Fetch invitations
      const invitationsResponse = await axios.get<Invitation[]>('http://localhost:5000/api/invitations', {
        headers: { email: roleResponse.data.email }
      });
      setInvitations(invitationsResponse.data);

      // If faculty, fetch alumni list
      if (roleResponse.data.role === 'faculty') {
        const alumniResponse = await axios.get<Alumni[]>('http://localhost:5000/api/get_alumni', {
          headers: { email: userEmail }
        });
        setAlumniList(alumniResponse.data);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error('Error fetching user data:', err);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const roleResponse = await axios.get('http://localhost:5000/api/current-user', {
            headers: { email: localStorage.getItem('email') },
              withCredentials: true,
          });
      
      
      await axios.post(
        'http://localhost:5000/api/invitations/send',
        { receiverEmail, description },
        { headers: { email:roleResponse.data.email  } }
      );
      setDescription('');
      setReceiverEmail('');
      fetchUserData();
    } catch (err) {
      setError('Failed to send invitation');
      console.error('Error sending invitation:', err);
    }
  };

  const handleResponse = async (invitationId: string, status: 'accepted' | 'rejected') => {
    try {
        const roleResponse = await axios.get('http://localhost:5000/api/current-user', {
            headers: { email: localStorage.getItem('email') },
              withCredentials: true,
          });
      await axios.put(
        `http://localhost:5000/api/invitations/${invitationId}/respond`,
        { status },
        { headers: { email: roleResponse.data.email } }
      );
      fetchUserData();
    } catch (err) {
      setError('Failed to respond to invitation');
      console.error('Error responding to invitation:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Invitations</h1>

      {/* Faculty: Send Invitation Form */}
      {role === 'faculty' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Send New Invitation</h2>
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Alumni</label>
              <select
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Alumni</option>
                {alumniList.map((alumni) => (
                  <option key={alumni._id} value={alumni.email}>
                    {alumni.name} ({alumni.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                required
                minLength={10}
                placeholder="Write your invitation message (at least 10 characters)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Invitation
            </button>
          </form>
        </div>
      )}

      {/* Invitation List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {role === 'faculty' ? 'Sent Invitations' : 'Received Invitations'}
        </h2>
        
        {invitations.length === 0 ? (
          <p className="text-gray-500">No invitations found</p>
        ) : (
          invitations.map((invitation) => (
            <div key={invitation._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {role === 'faculty' ? (
                      <>To: <span className="text-blue-600">{invitation.receiverId.name}</span> ({invitation.receiverId.email})</>
                    ) : (
                      <>From: <span className="text-blue-600">{invitation.senderId.name}</span> ({invitation.senderId.email})</>
                    )}
                  </p>
                  <p className="text-gray-600 mt-2">{invitation.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sent on: {formatDate(invitation.createdAt)} | 
                    Status: <span className={`font-medium ${
                      invitation.status === 'pending' ? 'text-yellow-600' :
                      invitation.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {invitation.status}
                    </span>
                  </p>
                </div>
                
                {role === 'alumni' && invitation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleResponse(invitation._id, 'accepted')}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(invitation._id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Invitations;