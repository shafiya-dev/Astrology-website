import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, User, Clock, CheckCircle } from 'lucide-react';

const Account = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="bg-card-bg border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
            <User size={48} />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-text-muted">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-accent" size={24} />
            <h2 className="text-2xl font-bold text-white">Notifications & Updates</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-muted">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-card-bg border border-white/5 rounded-2xl p-12 text-center shadow-lg">
              <CheckCircle className="mx-auto text-accent mb-4 opacity-50" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">You're all caught up!</h3>
              <p className="text-text-muted">Any replies to your inquiries or appointment updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notif => (
                <div key={notif._id} className="bg-card-bg border border-white/10 rounded-2xl p-6 shadow-lg hover:border-white/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <Bell size={20} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                        <h4 className="text-white font-semibold text-lg">Message from Admin</h4>
                        <div className="flex items-center text-xs text-text-muted gap-1">
                          <Clock size={14} />
                          <span>{new Date(notif.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Account;
