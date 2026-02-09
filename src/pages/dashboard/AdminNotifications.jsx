import React, { useState } from 'react';
import { Bell, Send, X } from 'lucide-react';
import Editor from 'gov-rich-text-editor';

const AdminNotifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState('');
  const [emailPelamar, setEmailPelamar] = useState('');
  const [judulNotifikasi, setJudulNotifikasi] = useState('');
  const [subjudulNotifikasi, setSubjudulNotifikasi] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNotificationContent(''); // Clear content when opening modal
    setEmailPelamar('');
    setJudulNotifikasi('');
    setSubjudulNotifikasi('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitNotification = () => {
    console.log('Sending Notification:', {
      emailPelamar,
      judulNotifikasi,
      subjudulNotifikasi,
      notificationContent,
    });
    // Here you would typically send this data to your backend
    handleCloseModal();
  };

  const handleContentChange = (content) => {
    setNotificationContent(content);
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Buat Notifikasi Baru
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <Bell className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Belum ada notifikasi</p>
          <p className="text-sm text-gray-500 max-w-md">
            Belum ada riwayat notifikasi yang dikirimkan kepada pelamar. Anda dapat mengirim notifikasi baru sekarang.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-md bg-white shadow-lg h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Kirim Notifikasi</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <span className="sr-only">Tutup</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="email-pelamar" className="block text-sm font-medium text-gray-700">
                  Email Pelamar
                </label>
                <input
                  type="email"
                  name="email-pelamar"
                  id="email-pelamar"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="nama@email.com"
                  value={emailPelamar}
                  onChange={(e) => setEmailPelamar(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">Pastikan email terdaftar di sistem.</p>
              </div>
              <div className="mb-4">
                <label htmlFor="judul-notifikasi" className="block text-sm font-medium text-gray-700">
                  Judul Notifikasi
                </label>
                <input
                  type="text"
                  name="judul-notifikasi"
                  id="judul-notifikasi"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Contoh: Undangan Interview"
                  value={judulNotifikasi}
                  onChange={(e) => setJudulNotifikasi(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subjudul-notifikasi" className="block text-sm font-medium text-gray-700">
                  Subjudul (Opsional)
                </label>
                <input
                  type="text"
                  name="subjudul-notifikasi"
                  id="subjudul-notifikasi"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ringkasan singkat pesan..."
                  value={subjudulNotifikasi}
                  onChange={(e) => setSubjudulNotifikasi(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="isi-pesan" className="block text-sm font-medium text-gray-700">
                  Isi Pesan
                </label>
                <div className="mt-1 w-full">
                  <Editor
                    value={notificationContent}
                    onChange={handleContentChange}
                    className="min-h-[300px] border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleCloseModal}
              >
                Batal
              </button>
              <button
                type="button"
                className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSubmitNotification}
              >
                Kirim Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
