import { useEffect, useState } from 'react';
import { Trash2, Reply, X } from 'lucide-react';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reply Modal State
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({ userEmail: '', message: '' });
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyStatus, setReplyStatus] = useState('');

  const fetchLeads = () => {
    fetch('http://localhost:5000/api/admin/leads', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        if (data.contacts) {
          setMessages(data.contacts);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Database connection failed or MongoDB is not running.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setMessages(messages.filter(msg => msg._id !== id));
      } else {
        alert('Failed to delete message');
      }
    } catch (err) {
      alert('Error deleting message');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    setReplyStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(replyData)
      });
      
      if (res.ok) {
        setReplyStatus('success');
        setTimeout(() => {
          setShowReplyModal(false);
          setReplyData({ userEmail: '', message: '' });
          setReplyStatus('');
        }, 1500);
      } else {
        setReplyStatus('error');
      }
    } catch (err) {
      setReplyStatus('error');
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-text-muted text-lg">
            View all client contact inquiries stored in the database.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-text-muted">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 p-6 rounded-xl text-center">
            <h2 className="text-2xl text-red-200 font-bold mb-2">Error</h2>
            <p className="text-red-100">{error}</p>
            <p className="text-red-200 text-sm mt-4">Please ensure your backend server and MongoDB are running.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-card-bg border border-white/5 p-12 rounded-2xl text-center">
            <p className="text-xl text-text-muted">No contact messages found.</p>
          </div>
        ) : (
          <div className="bg-card-bg rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-accent text-sm uppercase tracking-wider">
                    <th className="p-4 border-b border-white/10 font-semibold">Date / Time</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Full Name</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Phone Number</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Email Address</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Message</th>
                    <th className="p-4 border-b border-white/10 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.map((msg, index) => (
                    <tr key={msg._id || index} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-text-muted whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-white whitespace-nowrap">
                        {msg.name}
                      </td>
                      <td className="p-4 text-text-muted whitespace-nowrap">
                        {msg.phone}
                      </td>
                      <td className="p-4 text-accent whitespace-nowrap">
                        {msg.email}
                      </td>
                      <td className="p-4 text-sm text-text-muted max-w-xs truncate" title={msg.message}>
                        {msg.message}
                      </td>
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button 
                          onClick={() => {
                            setReplyData({ userEmail: msg.email, message: '' });
                            setShowReplyModal(true);
                          }}
                          className="text-accent hover:text-accent-hover transition-colors inline-flex items-center"
                          title="Reply to User"
                        >
                          <Reply size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(msg._id)}
                          className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-card-bg border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowReplyModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-2 text-white">Reply to User</h3>
            <p className="text-sm text-text-muted mb-6">Replying to: <span className="text-accent">{replyData.userEmail}</span></p>
            
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Message or Appointment Details</label>
                <textarea 
                  required
                  rows="5"
                  value={replyData.message}
                  onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent resize-none"
                  placeholder="Type your reply here..."
                ></textarea>
              </div>

              {replyStatus === 'success' && (
                <p className="text-sm text-center text-green-400">Reply sent successfully!</p>
              )}
              {replyStatus === 'error' && (
                <p className="text-sm text-center text-red-400">Failed to send reply. Try again.</p>
              )}

              <button 
                type="submit"
                disabled={replyLoading}
                className="w-full px-6 py-3 rounded-full font-semibold bg-accent text-primary hover:bg-accent-hover transition-colors mt-4"
              >
                {replyLoading ? 'Sending...' : 'Send Reply'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
