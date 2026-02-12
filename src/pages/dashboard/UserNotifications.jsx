import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCircle, Clock, Trash2 } from 'lucide-react';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${window.API_BASE_URL}/api/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notification_id: id })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifikasi</h1>
      <p className="text-gray-600 mb-6">Pemberitahuan terbaru mengenai akun dan lamaran Anda.</p>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p>Memuat notifikasi...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-96">
          <Bell className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Notifikasi</h2>
          <p className="text-gray-600">Anda akan menerima notifikasi di sini jika ada pembaruan terkait lamaran Anda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-sm border p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${!notif.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-gray-100'}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className={`p-2 rounded-lg ${!notif.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-base ${!notif.is_read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                      {notif.title || 'Pemberitahuan'}
                    </h3>
                    <p className={`text-sm ${!notif.is_read ? 'text-gray-800' : 'text-gray-600'}`}>
                      {notif.subject || 'Informasi Terbaru'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{notif.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider whitespace-nowrap ml-2">
                      {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">{selectedNotification.title || 'Detail Notifikasi'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Tutup</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Subjek</h4>
                <p className="text-base font-semibold text-gray-900">{selectedNotification.subject || '-'}</p>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Pesan</h4>
                <div className="text-gray-700 whitespace-pre-wrap">{selectedNotification.message}</div>
              </div>
              <div className="text-right text-xs text-gray-400">
                Diterima pada {new Date(selectedNotification.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-2">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                onClick={closeModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
