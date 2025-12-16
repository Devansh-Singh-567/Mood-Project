import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Moon, Sun, Calendar, TrendingUp, Bell, LogOut, Plus, X, Check } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const MoodWellnessApp = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('log');
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [loginMode, setLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const moods = [
    { name: 'Overwhelmed', emoji: '😰', color: 'from-red-500 to-red-700', value: 'Overwhelmed' },
    { name: 'Demotivated', emoji: '😔', color: 'from-orange-500 to-orange-700', value: 'Demotivated' },
    { name: 'Anxious', emoji: '😟', color: 'from-yellow-500 to-yellow-700', value: 'Anxious' },
    { name: 'Stressed', emoji: '😣', color: 'from-amber-500 to-amber-700', value: 'Stressed' },
    { name: 'Sad', emoji: '😢', color: 'from-blue-500 to-blue-700', value: 'Sad' },
    { name: 'Lazy', emoji: '😴', color: 'from-indigo-500 to-indigo-700', value: 'Lazy' },
    { name: 'Bored', emoji: '😑', color: 'from-gray-500 to-gray-700', value: 'Bored' },
    { name: 'Neutral', emoji: '😐', color: 'from-slate-500 to-slate-700', value: 'Neutral' },
    { name: 'Motivated', emoji: '😊', color: 'from-green-500 to-green-700', value: 'Motivated' },
    { name: 'Happy', emoji: '😄', color: 'from-emerald-500 to-emerald-700', value: 'Happy' },
  ];

  useEffect(() => {
    if (token) {
      fetchMoodHistory();
    }
  }, [token]);

  const fetchMoodHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/mood/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMoodHistory(data);
      }
    } catch (err) {
      console.error('Error fetching mood history:', err);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (loginMode) {
        const formBody = new URLSearchParams();
        formBody.append('username', formData.email);
        formBody.append('password', formData.password);
        
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody
        });
        
        if (res.ok) {
          const data = await res.json();
          setToken(data.access_token);
          setUser({ email: formData.email });
        } else {
          alert('Invalid credentials');
        }
      } else {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (res.ok) {
          alert('Registration successful! Please login.');
          setLoginMode(true);
          setFormData({ name: '', email: '', password: '' });
        } else {
          alert('Registration failed');
        }
      }
    } catch (err) {
      alert('Connection error. Make sure your backend is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const logMood = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mood/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood: selectedMood.value, intensity })
      });
      
      if (res.ok) {
        setSelectedMood(null);
        setIntensity(5);
        fetchMoodHistory();
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = '✨ Mood logged successfully!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    } catch (err) {
      alert('Error logging mood');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMoodHistory([]);
  };

  if (!token) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} flex items-center justify-center p-4`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 w-full max-w-md backdrop-blur-lg`}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌈</div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Mood Wellness
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your emotions, improve your life
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                loginMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setLoginMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                !loginMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            {!loginMode && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                } border-2 border-transparent focus:border-purple-500 outline-none transition-all`}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              } border-2 border-transparent focus:border-purple-500 outline-none transition-all`}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              } border-2 border-transparent focus:border-purple-500 outline-none transition-all`}
            />
            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : loginMode ? 'Login' : 'Register'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              💡 Make sure your backend is running on localhost:8000
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} transition-colors`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌈</div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Mood Wellness
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'} hover:scale-110 transition-transform`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'log', label: 'Log Mood', icon: Plus },
            { id: 'history', label: 'History', icon: Calendar },
            { id: 'insights', label: 'Insights', icon: TrendingUp },
            { id: 'reminders', label: 'Reminders', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:scale-105`
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === 'log' && (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                How are you feeling today?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood)}
                    className={`relative p-6 rounded-2xl transition-all transform hover:scale-110 ${
                      selectedMood?.value === mood.value
                        ? `bg-gradient-to-br ${mood.color} text-white shadow-2xl scale-110`
                        : `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:shadow-lg`
                    }`}
                  >
                    <div className="text-5xl mb-2">{mood.emoji}</div>
                    <div className={`text-sm font-semibold ${
                      selectedMood?.value === mood.value ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {mood.name}
                    </div>
                    {selectedMood?.value === mood.value && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                        <Check size={16} className="text-green-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedMood && (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Intensity: {intensity}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Low</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>High</span>
                    </div>
                  </div>

                  <button
                    onClick={logMood}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Logging...' : 'Log This Mood'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              Your Mood Journey
            </h2>
            {moodHistory.length > 0 ? (
              <div className="space-y-4">
                {moodHistory.slice(-10).reverse().map((log, idx) => {
                  const mood = moods.find(m => m.value === log.mood);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{mood?.emoji}</div>
                        <div>
                          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {log.mood}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(log.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Intensity: {log.intensity}/10
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${mood?.color} text-white`}>
                          Score: {log.score}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No mood logs yet. Start tracking your emotions!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              Mood Insights
            </h2>
            {moodHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={moodHistory.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Track more moods to see insights
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Mood Check Reminders
              </h2>
              <button
                onClick={() => setShowReminderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Add Reminder
              </button>
            </div>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Set reminders to check in with yourself regularly
              </p>
            </div>
          </div>
        )}
      </main>

      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                New Reminder
              </h3>
              <button onClick={() => setShowReminderModal(false)} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Reminder title (e.g., Morning check-in)"
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} outline-none`}
              />
              <input
                type="time"
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} outline-none`}
              />
              <button
                onClick={() => {
                  alert('Reminder functionality will be connected to your backend!');
                  setShowReminderModal(false);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodWellnessApp;