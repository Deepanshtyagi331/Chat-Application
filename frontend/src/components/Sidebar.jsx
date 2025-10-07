import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const Sidebar = ({ 
  user, 
  chats, 
  setChats,
  selectedChat, 
  onSelectChat, 
  onLogout, 
  onToggleTheme, 
  theme,
  onlineUsers,
  onCallUser
}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('/chats');
        setChats(response.data.chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, setChats]);

  useEffect(() => {
    if (search) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleSearch = async () => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/users?search=${encodeURIComponent(search)}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const response = await axios.post('/chats', { userId });
      
      // Check if chat already exists in the chats list
      const chatExists = chats.find(chat => chat._id === response.data.chat._id);
      
      if (!chatExists) {
        // Add the new chat to the beginning of the chats list
        setChats(prevChats => [response.data.chat, ...prevChats]);
      }
      
      // Select the chat
      onSelectChat(response.data.chat);
      
      // Clear search
      setSearchResults([]);
      setSearch('');
    } catch (error) {
      console.error('Error accessing chat:', error);
      alert('Failed to create chat. Please try again.');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleNewChat = () => {
    setSearch('');
    setSearchResults([]);
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search users..."]');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="ml-2">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </h2>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={onToggleTheme}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-gray-50 dark:bg-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Search Results */}
      {search && (
        <div className="px-2 pb-2 flex-shrink-0">
          {loading ? (
            <div className="flex justify-center py-2">
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => accessChat(user._id)}
                  className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : search && !loading ? (
            <div className="text-center py-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No users found
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="px-2 py-1.5 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Chats
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  selectedChat?._id === chat._id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {chat.isGroupChat
                        ? chat.chatName.charAt(0).toUpperCase()
                        : chat.users
                            .find((u) => u._id !== user._id)
                            ?.name.charAt(0)
                            .toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2 flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.isGroupChat
                        ? chat.chatName
                        : chat.users.find((u) => u._id !== user._id)?.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No chats yet
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Button */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center justify-center py-1.5 px-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>
    </div>
  );
};

export default Sidebar;