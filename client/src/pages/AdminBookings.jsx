import { useEffect, useState } from 'react';
import { Calendar, Trash2, X, Eye, Clock, Check, Phone, Mail } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const fetchLeads = () => {
    fetch('https://astrology-backend-xhfi.onrender.com/api/admin/leads', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        if (data.bookings) {
          setBookings(data.bookings);
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

  // Action Handlers
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://astrology-backend-xhfi.onrender.com/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
        if (viewBooking && viewBooking._id === id) {
          setViewBooking({ ...viewBooking, status: newStatus });
        }
      } else {
        alert('Failed to update booking status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const getServiceInfo = (serviceName) => {
    if (serviceName.includes('Vedic')) return { price: 2100, duration: '60 min' };
    if (serviceName.includes('Palmistry')) return { price: 1500, duration: '45 min' };
    if (serviceName.includes('Numerology')) return { price: 1800, duration: '45 min' };
    if (serviceName.includes('Vastu')) return { price: 3500, duration: '90 min' };
    return { price: '-', duration: '-' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pt-28 pb-20 px-4 md:px-8 flex justify-center items-center cosmic-bg relative">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin relative z-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary pt-28 pb-20 px-4 md:px-8 flex justify-center items-center cosmic-bg relative">
        <div className="glass-card p-8 rounded-2xl text-center border-red-500 border relative z-10">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchLeads} className="mt-4 px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent-hover transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-28 pb-20 px-4 md:px-8 cosmic-bg relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-accent mb-4">Admin Dashboard</h1>
            <div className="flex gap-4 mb-4 border-b border-white/10 pb-4">
              <a href="/admin/messages" className="text-text-muted hover:text-white transition-colors pb-1">Messages</a>
              <a href="/admin/bookings" className="text-accent font-bold border-b-2 border-accent pb-1">Bookings</a>
            </div>
            <p className="text-text-muted">Manage your service consultation requests</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <span className="text-accent font-bold text-xl">{bookings.length}</span>
            <span className="text-text-muted ml-2 text-sm">Total Bookings</span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border-white/10">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-text-muted">When clients book consultations, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-card-bg/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-accent text-xs md:text-sm uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 border-b border-white/10 font-semibold">Client</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Service</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Date & Time</th>
                    <th className="p-4 border-b border-white/10 font-semibold">Status</th>
                    <th className="p-4 border-b border-white/10 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((booking, index) => (
                    <tr key={booking._id || index} className="hover:bg-white/10 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-white whitespace-nowrap">{booking.name}</p>
                        <p className="text-sm text-text-muted whitespace-nowrap">{booking.email}</p>
                        <p className="text-sm text-text-muted whitespace-nowrap">{booking.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white whitespace-nowrap">{booking.service}</p>
                        <p className="text-sm text-accent whitespace-nowrap">₹{getServiceInfo(booking.service).price}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white flex items-center gap-2 whitespace-nowrap"><Calendar className="w-4 h-4 text-text-muted" /> {booking.preferredDateTime}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          booking.status === 'Accepted' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : booking.status === 'Rejected' 
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        {(booking.status === 'Pending' || !booking.status) && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                              className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all inline-flex items-center"
                              title="Accept Booking"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                              className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all inline-flex items-center"
                              title="Reject Booking"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => {
                            setViewBooking(booking);
                            setShowViewModal(true);
                          }}
                          className="p-2 rounded-full bg-white/5 text-text hover:text-white hover:bg-white/10 transition-all inline-flex items-center"
                          title="View Details"
                        >
                          <Eye size={16} />
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

      {/* View Modal */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A0B2E] border border-white/10 p-6 md:p-8 rounded-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-heading font-bold text-accent mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
              <Calendar className="w-6 h-6" /> Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-text-muted uppercase tracking-wider mb-1">Client Info</h4>
                  <p className="text-white font-bold text-lg">{viewBooking.name}</p>
                  <p className="text-text-muted flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> {viewBooking.email}</p>
                  <p className="text-text-muted flex items-center gap-2 mt-1"><Phone className="w-4 h-4" /> {viewBooking.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-text-muted uppercase tracking-wider mb-1">Consultation Details</h4>
                  <p className="text-white font-bold text-lg text-accent">{viewBooking.service}</p>
                  <p className="text-text-muted flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" /> {viewBooking.preferredDateTime}</p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-text-muted text-sm px-2 py-1 bg-white/5 rounded">Duration: {getServiceInfo(viewBooking.service).duration}</p>
                    <p className="text-text-muted text-sm px-2 py-1 bg-white/5 rounded">Price: ₹{getServiceInfo(viewBooking.service).price}</p>
                  </div>
                </div>
              </div>
            </div>

            {viewBooking.notes && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                <h4 className="text-sm text-text-muted uppercase tracking-wider mb-2">Message / Guidance Required</h4>
                <p className="text-white whitespace-pre-wrap">{viewBooking.notes}</p>
              </div>
            )}
            
            <div className="flex gap-4 justify-end border-t border-white/10 pt-6 mb-4">
              {(viewBooking.status === 'Pending' || !viewBooking.status) ? (
                <>
                  <button 
                    onClick={() => { handleUpdateStatus(viewBooking._id, 'Rejected'); setShowViewModal(false); }}
                    className="px-6 py-2 rounded-xl font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <X size={18} /> Reject
                  </button>
                  <button 
                    onClick={() => { handleUpdateStatus(viewBooking._id, 'Accepted'); setShowViewModal(false); }}
                    className="px-6 py-2 rounded-xl font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                  >
                    <Check size={18} /> Accept
                  </button>
                </>
              ) : (
                <div className={`px-4 py-2 rounded-lg font-bold border ${viewBooking.status === 'Accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  Status: {viewBooking.status}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-text-muted pt-4 border-t border-white/10">
              <span>Booking ID: <span className="text-white font-mono">{viewBooking._id}</span></span>
              <span>Requested: {new Date(viewBooking.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
