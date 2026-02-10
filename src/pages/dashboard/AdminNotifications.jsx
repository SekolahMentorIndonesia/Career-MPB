import React, { useState, useEffect } from 'react';
import { Bell, Send, X, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import clsx from 'clsx';

const AdminNotifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [judulNotifikasi, setJudulNotifikasi] = useState('');
  const [subjudulNotifikasi, setSubjudulNotifikasi] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/users`, {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNotificationContent('');
    setSelectedUser(null);
    setJudulNotifikasi('');
    setSubjudulNotifikasi('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitNotification = async () => {
    if (!selectedUser || !judulNotifikasi || !subjudulNotifikasi || !notificationContent) {
      alert("Semua field (User, Judul, Subjek, Pesan) harus diisi");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          title: judulNotifikasi,
          subject: subjudulNotifikasi,
          message: notificationContent,
          type: 'manual'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert("Notifikasi berhasil dikirim!");
        handleCloseModal();
      } else {
        alert(result.message || "Gagal mengirim notifikasi");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Terjadi kesalahan saat mengirim notifikasi");
    } finally {
      setIsSending(false);
    }
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
          Buat Notifikasi Baru
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 text-center h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-2xl p-12 border border-dashed border-gray-200 w-full max-w-lg">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada riwayat notifikasi</h3>
          <p className="text-gray-500 text-center leading-relaxed">
            Anda belum mengirimkan notifikasi apapun kepada pelamar. <br />
            Klik tombol di atas untuk mulai mengirim pesan.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Kirim Notifikasi</h3>
                <p className="text-sm text-gray-500">Kirim pesan personal ke pelamar</p>
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

              {/* User Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Penerima</label>
                <Listbox value={selectedUser} onChange={setSelectedUser}>
                  <div className="relative mt-1">
                    <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm hover:border-gray-400 transition-colors">
                      <span className="block truncate">
                        {selectedUser ? (
                          <span className="flex items-center">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">
                              {selectedUser.name.charAt(0)}
                            </span>
                            {selectedUser.name} <span className="text-gray-400 ml-1 font-normal">({selectedUser.email})</span>
                          </span>
                        ) : <span className="text-gray-500">Pilih pelamar dari daftar...</span>}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {users.length === 0 ? (
                        <div className="py-2 px-4 text-gray-500 italic">Tidak ada user ditemukan.</div>
                      ) : (
                        users.map((user) => (
                          <ListboxOption
                            key={user.id}
                            className={({ active }) =>
                              clsx(
                                active ? 'text-white bg-blue-600' : 'text-gray-900',
                                'relative cursor-pointer select-none py-3 pl-4 pr-9'
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
                          </ListboxOption>
                        ))
                      )}
                    </ListboxOptions>
                  </div>
                </Listbox>
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

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-100 gap-3">
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
                    Kirim Notifikasi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
