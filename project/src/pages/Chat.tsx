import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Message {
  _id?: string;
  roomId: string;
  senderId: { _id: string; name: string; email: string };
  message: string;
  timestamp: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize Socket.IO and user data
  useEffect(() => {
    setIsLoading(true);
    if (!socketRef.current) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      });

      socketRef.current = newSocket;

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setTimeout(() => {
          newSocket.connect();
        }, 1000);
      });
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/current-user', {
          headers: { email: localStorage.getItem('email') },
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat/users', {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCurrentUser();
    fetchUsers();

    // Set up auto-refresh for users list every 30 seconds
    refreshIntervalRef.current = setInterval(fetchUsers, 30000);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('receiveMessage');
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [navigate]);

  // Handle room joining and message receiving
  useEffect(() => {
    if (!socketRef.current || !selectedUser || !currentUser) return;

    const roomId = [currentUser._id, selectedUser._id].sort().join('-');
    socketRef.current.emit('joinRoom', { roomId });

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/history/${roomId}`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    const messageHandler = (message: Message) => {
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(
          (m) => m._id === message._id || 
                (m.timestamp === message.timestamp && m.senderId._id === message.senderId._id)
        );
        return messageExists ? prev : [...prev, message];
      });
    };

    fetchChatHistory();
    socketRef.current.on('receiveMessage', messageHandler);

    // Set up auto-refresh for messages every 10 seconds
    const messageRefreshInterval = setInterval(fetchChatHistory, 0.5);

    return () => {
      socketRef.current?.off('receiveMessage', messageHandler);
      clearInterval(messageRefreshInterval);
    };
  }, [selectedUser, currentUser]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || !messageInput.trim() || !selectedUser || !currentUser) return;

    const roomId = [currentUser._id, selectedUser._id].sort().join('-');
    const messageData = {
      roomId,
      senderId: currentUser._id,
      message: messageInput,
    };

    // Optimistically add the message to the UI before sending
    const optimisticMessage: Message = {
      roomId,
      senderId: { _id: currentUser._id, name: currentUser.name, email: currentUser.email },
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageInput('');
    
    socketRef.current.emit('sendMessage', messageData);
  };

  const deleteAllChats = async () => {
    try {
      if (!currentUser) return;
      
      const confirmed = window.confirm('Are you sure you want to delete all your chats? This action cannot be undone.');
      if (!confirmed) return;
  
      const response = await axios.delete('http://localhost:5000/api/chat/delete-all', {
        headers: { email: localStorage.getItem('email') },
        withCredentials: true
      });
      
      // Clear messages from state
      setMessages([]);
      setSelectedUser(null);
      
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting chats:', error);
      alert('Failed to delete chats');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)]">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* User List */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat with</h2>
        {users
          .filter((user) => user?._id && currentUser?._id && user._id !== currentUser._id)
          .map((user) => (
            <div
              key={user._id}
              className={`p-2 cursor-pointer rounded ${
                selectedUser?._id === user._id ? 'bg-indigo-200' : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>
          ))}
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{selectedUser.name}</h2>
          <p className="text-sm">{selectedUser.role}</p>
        </div>
        <button
          onClick={deleteAllChats}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete All Chats
        </button>
      </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => {
                const isCurrentUser = msg.senderId?._id === currentUser?._id;
                return (
                  <div
                    key={msg._id || msg.timestamp}
                    className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isCurrentUser
                          ? 'bg-indigo-500 text-white rounded-tr-none'
                          : 'bg-gray-200 rounded-tl-none'
                      }`}
                    >
                      {!isCurrentUser && (
                        <p className="font-semibold text-sm text-indigo-700">{msg.senderId.name}</p>
                      )}
                      <p className="break-words">{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 p-2 border rounded"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;