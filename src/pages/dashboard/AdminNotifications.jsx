import React, { useState, useEffect } from 'react';
import { Bell, Send, X, Check, ChevronsUpDown, Loader2, Trash2, EyeOff } from 'lucide-react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { toast } from '../../hooks/useToast';

const AdminNotifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [judulNotifikasi, setJudulNotifikasi] = useState('');
  const [subjudulNotifikasi, setSubjudulNotifikasi] = useState('');
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedViewNotif, setSelectedViewNotif] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New state for 2-step flow
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(['dashboard']); // Default to dashboard

  // Combobox Search State
  const [query, setQuery] = useState('');

  const filteredUsers =
    query === ''
      ? users
      : users.filter((user) => {
        return (
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        );
      });

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Filter only regular users, ensuring case-insensitive comparison
        const regularUsers = data.data.filter(u => u.role && u.role.toUpperCase() === 'USER');
        setUsers(regularUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/admin/notifications`, {
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
      toast.error('Gagal memuat riwayat notifikasi');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsConfirmationStep(false);
    setNotificationContent('');
    setSelectedUser(null);
    setJudulNotifikasi('');
    setSubjudulNotifikasi('');
    setSelectedChannels(['dashboard']);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsConfirmationStep(false);
    setSelectedChannels(['dashboard']);
  };

  const handleNextStep = () => {
    if (!selectedUser || !judulNotifikasi || !subjudulNotifikasi || !notificationContent) {
      toast.warning("Semua field (User, Judul, Subjek, Pesan) harus diisi");
      return;
    }
    setIsConfirmationStep(true);
  };

  const handleBackStep = () => {
    setIsConfirmationStep(false);
  };

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        // Prevent unchecking the last channel
        if (prev.length === 1) {
          toast.warning("Minimal satu metode pengiriman harus dipilih");
          return prev;
        }
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  const handleSubmitNotification = async () => {
    // Validation is already done in handleNextStep, but double check
    if (!selectedUser || !judulNotifikasi || !subjudulNotifikasi || !notificationContent) {
      toast.warning("Data tidak lengkap");
      return;
    }

    setIsSending(true);
    try {
      const url = `${window.API_BASE_URL}/api/notifications/send`;
      const method = 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          title: judulNotifikasi,
          subject: subjudulNotifikasi,
          message: notificationContent,
          channels: selectedChannels
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Notifikasi berhasil dikirim!");
        handleCloseModal();
        fetchNotifications(); // Refresh list
      } else {
        toast.error(result.message || "Gagal memproses notifikasi");
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      toast.error("Terjadi kesalahan saat memproses notifikasi");
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenDetail = (notif) => {
    setSelectedViewNotif(notif);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedViewNotif(null);
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-600">Kelola notifikasi dan pesan untuk pelamar.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <Send className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Kirim Notifikasi
        </button>
      </div>

      {/* Notification History */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        {isLoadingNotifications ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada riwayat notifikasi</h3>
            <p className="text-gray-500 text-center leading-relaxed">
              Anda belum mengirimkan notifikasi apapun kepada pelamar. <br />
              Klik tombol di atas untuk mulai mengirim pesan.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjek</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notif) => (
                    <tr
                      key={notif.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleOpenDetail(notif)}>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                            {notif.user_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{notif.user_name}</div>
                            <div className="text-xs text-gray-500">{notif.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenDetail(notif)}>
                        <div className="text-sm font-medium text-gray-900">{notif.title}</div>
                      </td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenDetail(notif)}>
                        <div className="text-sm text-gray-600">{notif.subject}</div>
                      </td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenDetail(notif)}>
                        <div className="text-sm text-gray-600 max-w-xs truncate">{notif.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => handleOpenDetail(notif)}>
                        {new Date(notif.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 active:bg-gray-50 transition-colors"
                  onClick={() => handleOpenDetail(notif)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                        {notif.user_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{notif.user_name}</div>
                        <div className="text-[10px] text-gray-500">{notif.user_email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-800">{notif.title}</div>
                    <div className="text-xs text-blue-600 font-medium">{notif.subject}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 mt-1 italic">"{notif.message}"</div>
                    <div className="text-[10px] text-gray-400 mt-2 flex justify-end italic font-medium">
                      {new Date(notif.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isConfirmationStep ? 'Konfirmasi Pengiriman' : 'Kirim Notifikasi'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isConfirmationStep ? 'Pilih metode pengiriman pesan' : 'Isi detail pesan untuk pelamar'}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                onClick={handleCloseModal}
              >
                <span className="sr-only">Tutup</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {!isConfirmationStep ? (
                /* Step 1: Input Form */
                <>
                  {/* User Selection (Combobox) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Penerima</label>
                    <Combobox value={selectedUser} onChange={setSelectedUser}>
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-xl border border-gray-300 bg-white text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                          <ComboboxInput
                            className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(person) => person?.name}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari nama atau email..."
                          />
                          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </ComboboxButton>
                        </div>
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredUsers.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Tidak ditemukan.
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <ComboboxOption
                                key={user.id}
                                className={({ active }) =>
                                  clsx(
                                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                    'relative cursor-default select-none py-3 pl-4 pr-9'
                                  )
                                }
                                value={user}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3", active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600")}>
                                        {user.name.charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className={clsx(selected ? 'font-semibold' : 'font-medium', 'block truncate')}>
                                          {user.name}
                                        </span>
                                        <span className={clsx("text-xs", active ? "text-blue-100" : "text-gray-500")}>
                                          {user.email}
                                        </span>
                                      </div>
                                    </div>
                                    {selected ? (
                                      <span
                                        className={clsx(
                                          active ? 'text-white' : 'text-blue-600',
                                          'absolute inset-y-0 right-0 flex items-center pr-4'
                                        )}
                                      >
                                        <Check className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </div>
                    </Combobox>
                  </div>

                  {/* Title & Subject Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="judul-notifikasi" className="block text-sm font-bold text-gray-700 mb-1.5">
                        Judul Notifikasi
                      </label>
                      <input
                        type="text"
                        name="judul-notifikasi"
                        id="judul-notifikasi"
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                        placeholder="e.g. Undangan Interview"
                        value={judulNotifikasi}
                        onChange={(e) => setJudulNotifikasi(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="subjudul-notifikasi" className="block text-sm font-bold text-gray-700 mb-1.5">
                        Subjudul / Kategori
                      </label>
                      <input
                        type="text"
                        name="subjudul-notifikasi"
                        id="subjudul-notifikasi"
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                        placeholder="e.g. Tahap 2"
                        value={subjudulNotifikasi}
                        onChange={(e) => setSubjudulNotifikasi(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label htmlFor="isi-pesan" className="block text-sm font-bold text-gray-700 mb-1.5">
                      Isi Pesan
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="isi-pesan"
                        name="isi-pesan"
                        rows={6}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl p-3"
                        placeholder="Tulis pesan lengkap pemberitahuan di sini..."
                        value={notificationContent}
                        onChange={(e) => setNotificationContent(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-2 text-right">Mendukung format teks biasa.</p>
                    </div>
                  </div>
                </>
              ) : (
                /* Step 2: Confirmation & Channel Selection */
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Ringkasan Pesan</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <p><span className="font-semibold text-gray-600">Penerima:</span> {selectedUser?.name}</p>
                      <p><span className="font-semibold text-gray-600">Judul:</span> {judulNotifikasi}</p>
                      <p><span className="font-semibold text-gray-600">Subjek:</span> {subjudulNotifikasi}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 block">Pilih Metode Pengiriman</h4>
                    <div className="space-y-3">
                      <div
                        className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${selectedChannels.includes('dashboard') ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => toggleChannel('dashboard')}
                      >
                        <div className="flex items-center h-5">
                          <input
                            id="channel-dashboard"
                            name="channel-dashboard"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={selectedChannels.includes('dashboard')}
                            readOnly
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="channel-dashboard" className="font-bold text-gray-900 cursor-pointer">
                            Dashboard Notification
                          </label>
                          <p className="text-gray-500">Kirim notifikasi ke dashboard aplikasi user.</p>
                        </div>
                      </div>

                      <div
                        className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${selectedChannels.includes('email') ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => toggleChannel('email')}
                      >
                        <div className="flex items-center h-5">
                          <input
                            id="channel-email"
                            name="channel-email"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={selectedChannels.includes('email')}
                            readOnly
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="channel-email" className="font-bold text-gray-900 cursor-pointer">
                            Email (Gmail)
                          </label>
                          <p className="text-gray-500">Kirim salinan pesan ke alamat email user ({selectedUser?.email}).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-100 gap-3">
              {isConfirmationStep ? (
                <>
                  <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-gray-500"
                    onClick={handleBackStep}
                    disabled={isSending}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={handleSubmitNotification}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Sekarang
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-gray-500"
                    onClick={handleCloseModal}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={handleNextStep}
                  >
                    Lanjut
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Notification Modal */}
      {
        isDetailModalOpen && selectedViewNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseDetail}></div>

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Pesan</h3>
                  <p className="text-sm text-gray-500">Informasi lengkap notifikasi terkirim</p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  onClick={handleCloseDetail}
                >
                  <span className="sr-only">Tutup</span>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 block">Penerima</span>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                        {selectedViewNotif.user_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{selectedViewNotif.user_name}</div>
                        <div className="text-xs text-blue-600">{selectedViewNotif.user_email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Judul</span>
                      <p className="text-gray-900 font-semibold">{selectedViewNotif.title}</p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Subjek / Kategori</span>
                      <p className="text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-lg text-sm">{selectedViewNotif.subject}</p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Isi Pesan</span>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                        {selectedViewNotif.message}
                      </div>
                    </div>

                    <div className="text-right pt-2">
                      <span className="text-xs text-gray-400 font-medium italic">
                        Dikirim pada: {new Date(selectedViewNotif.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={handleCloseDetail}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminNotifications;
