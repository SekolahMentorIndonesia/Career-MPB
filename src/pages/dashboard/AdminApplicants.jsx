import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Briefcase, ChevronsUpDown, User, Loader2, FileText, Image, Award, Link as LinkIcon, AlertCircle, Layout, FolderOpen, ScrollText, CheckCircle, XCircle } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import clsx from 'clsx';

const statuses = [
  'Semua Status',
  'Dikirim',
  'Seleksi Administrasi',
  'Psikotes',
  'Interview',
  'Final',
  'Diterima',
  'Ditolak',
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Dikirim':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Dikirim</span>;
    case 'Administrasi':
    case 'Seleksi Administrasi':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Seleksi Administrasi</span>;
    case 'Psikotes':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Psikotes</span>;
    case 'Interview':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Interview</span>;
    case 'Diterima':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Diterima</span>;
    case 'Ditolak':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
    default:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
  }
};

const AdminApplicants = () => {
  const { showNotification } = useNotification();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  // Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateStatusData, setUpdateStatusData] = useState({ id: null, status: '' });

  // Notification Modal State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(['dashboard']); // Default to dashboard
  const [notificationData, setNotificationData] = useState({
    user: null,
    title: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [notifQuery, setNotifQuery] = useState('');
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  const filteredApplicantsForNotif = notifQuery === ''
    ? applicants
    : applicants.filter(app =>
      app.applicant_name.toLowerCase().includes(notifQuery.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(notifQuery.toLowerCase())
    );

  // Generic Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [searchQuery, statusFilter, applicants]);

  const fetchApplicants = async () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      showNotification('error', 'Unauthorized', 'Sesi Anda telah berakhir. Silakan login kembali.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplicants(data.data);
        setFilteredApplicants(data.data);
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal memuat data pelamar');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      showNotification('error', 'Gagal', 'Gagal memuat data pelamar');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplicants = () => {
    let result = applicants;

    if (statusFilter !== 'Semua Status') {
      result = result.filter(app => app.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app =>
        app.applicant_name.toLowerCase().includes(query) ||
        app.job_title.toLowerCase().includes(query) ||
        app.applicant_email.toLowerCase().includes(query)
      );
    }

    setFilteredApplicants(result);
  };

  // Detail Modal Actions
  const handleOpenDetailModal = async (applicant) => {
    // Show current data immediately for better UX
    setSelectedApplicant(applicant);
    setIsDetailModalOpen(true);

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/applications/${applicant.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setSelectedApplicant(result.data);
      }
    } catch (error) {
      console.error('Error fetching latest application details:', error);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicant(null);
  };

  // Update Status Actions
  const handleOpenUpdateModal = (applicant, newStatus, action = '') => {
    setUpdateStatusData({ id: applicant.id, status: newStatus, action: action });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateStatusData({ id: null, status: '', action: '' });
  };

  const handleConfirmUpdateStatus = async () => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/applications/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          application_id: updateStatusData.id,
          status: updateStatusData.status,
          action: updateStatusData.action
        })
      });

      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', `Status berhasil diperbarui`);
        fetchApplicants(); // Refresh data
        handleCloseUpdateModal();
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'status') {
      // Re-use current logic but with generic state
      handleUpdateStatusGeneric(
        confirmAction.payload.application_id,
        confirmAction.payload.status,
        confirmAction.payload.action
      );
    }

    setConfirmAction(null);
  };

  const handleUpdateStatusGeneric = async (id, status, action = '') => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/applications/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          application_id: id,
          status: status,
          action: action
        })
      });

      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', `Status berhasil diubah menjadi ${status}`);
        fetchApplicants();
        if (isDetailModalOpen) setIsDetailModalOpen(false); // Close detail modal on success if open
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    }
  };

  // Notification Modal Actions
  const handleOpenNotificationModal = (applicant = null) => {
    setNotificationData({
      user: applicant ? applicant : null,
      title: '',
      subject: '',
      message: ''
    });
    setNotifQuery('');
    setSelectedChannels(['dashboard']);
    setIsNotificationModalOpen(true);
    setIsConfirmationStep(false);
  };

  const handleNextStep = () => {
    if (!notificationData.user || !notificationData.title || !notificationData.subject || !notificationData.message) {
      showNotification('error', 'Gagal', 'Semua field wajib diisi');
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
        if (prev.length === 1) {
          showNotification('info', 'Info', 'Minimal satu metode pengiriman harus dipilih');
          return prev;
        }
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationData({ user: null, title: '', subject: '', message: '' });
    setSelectedChannels(['dashboard']);
    setIsConfirmationStep(false);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationData.user || !notificationData.title || !notificationData.subject || !notificationData.message) {
      showNotification('error', 'Gagal', 'Semua field wajib diisi');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: notificationData.user.user_id,
          title: notificationData.title,
          subject: notificationData.subject,
          message: notificationData.message,
          channels: selectedChannels
        })
      });

      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', data.message || 'Notifikasi berhasil dikirim');
        handleCloseNotificationModal();
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal mengirim notifikasi');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Pelamar</h1>
          <p className="text-gray-600">Kelola data pelamar yang masuk.</p>
        </div>
        <button
          onClick={() => handleOpenNotificationModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Kirim Notifikasi
        </button>
      </div>

      {/* Search and Filter Section - Outside Table */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cari pelamar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
            <Listbox value={statusFilter} onChange={setStatusFilter}>
              <div className="relative mt-1">
                <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                  <span className="block">{statusFilter}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {statuses.map((status, statusIdx) => (
                    <ListboxOption
                      key={statusIdx}
                      className={({ active }) =>
                        clsx(
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={status}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block')}>
                            {status}
                          </span>
                          {selected ? (
                            <span className={clsx(active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelamar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
                    <p className="mt-2 text-sm text-gray-500">Memuat data...</p>
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Tidak ada data pelamar ditemukan.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {applicant.applicant_photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                              src={applicant.applicant_photo.startsWith('http') ? applicant.applicant_photo : `${window.API_BASE_URL}${applicant.applicant_photo}`}
                              alt={applicant.applicant_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://ui-avatars.com/api/?name=" + applicant.applicant_name + "&background=DBEAFE&color=2563EB&bold=true";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{applicant.applicant_name}</div>
                          <div className="text-sm text-gray-500">{applicant.applicant_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{applicant.job_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(applicant.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(applicant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
                          title="Lihat Detail"
                          onClick={() => handleOpenDetailModal(applicant)}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Detail</span>
                        </button>

                        <button
                          className="p-1 px-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex items-center gap-1"
                          title="Kirim Pesan"
                          onClick={() => handleOpenNotificationModal(applicant)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Pesan</span>
                        </button>

                        {/* Stage-specific Actions */}
                        {(!applicant.status || applicant.status?.trim() === 'Dikirim' || applicant.status?.trim() === 'Seleksi Administrasi' || applicant.status?.trim() === 'Administrasi') && (
                          <button
                            onClick={() => handleOpenUpdateModal(applicant, 'Psikotes')}
                            className="p-1 px-2 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1"
                            title="Lanjut Psikotes"
                          >
                            <Check className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Psikotes</span>
                          </button>
                        )}

                        {(applicant.status?.trim() === 'Tes Psikotes' || applicant.status?.trim() === 'Psikotes') && (
                          <button
                            onClick={() => handleOpenUpdateModal(applicant, 'Interview')}
                            className="p-1 px-2 text-purple-600 hover:bg-purple-50 rounded transition-colors flex items-center gap-1"
                            title="Lanjut Interview"
                          >
                            <Check className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Interview</span>
                          </button>
                        )}

                        {applicant.status?.trim() === 'Interview' && (
                          <button
                            onClick={() => handleOpenUpdateModal(applicant, 'Final', 'accept')}
                            className="p-1 px-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1"
                            title="Terima Pelamar"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Terima</span>
                          </button>
                        )}

                        {/* Universal Reject Button */}
                        {applicant.status?.trim() !== 'Ditolak' && applicant.status?.trim() !== 'Diterima' && (
                          <button
                            onClick={() => handleOpenUpdateModal(applicant, applicant.status || 'Administrasi', 'reject')}
                            className="p-1 px-2 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                            title="Tolak"
                          >
                            <X className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Tolak</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Update Status */}
      <ConfirmationModal
        isOpen={isUpdateModalOpen}
        onCancel={handleCloseUpdateModal}
        title="Konfirmasi Update Status"
        message={`Apakah Anda yakin ingin mengubah status pelamar ini menjadi "${updateStatusData.status}"?`}
        confirmText="Ya, Update"
        onConfirm={handleConfirmUpdateStatus}
        type="success"
      />

      {/* Generic Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          isOpen={!!confirmAction}
          onCancel={() => setConfirmAction(null)}
          title="Konfirmasi"
          message={confirmAction.message}
          confirmText={confirmAction.confirmText || "Ya, Lanjutkan"}
          onConfirm={handleConfirmAction}
          type={confirmAction.confirmButtonClass?.includes('rose') ? 'danger' : 'success'}
        />
      )}

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseNotificationModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
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
                onClick={handleCloseNotificationModal}
              >
                <span className="sr-only">Tutup</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {!isConfirmationStep ? (
                <>
                  {/* User Selection (Combobox) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Penerima</label>
                    <Combobox value={notificationData.user} onChange={(user) => setNotificationData({ ...notificationData, user })}>
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-xl border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm">
                          <ComboboxInput
                            className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(user) => user ? `${user.applicant_name} (${user.job_title})` : ''}
                            onChange={(event) => setNotifQuery(event.target.value)}
                            placeholder="Ketik nama atau email..."
                          />
                          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </ComboboxButton>
                        </div>
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredApplicantsForNotif.length === 0 && notifQuery !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Tidak ada peserta ditemukan.
                            </div>
                          ) : (
                            filteredApplicantsForNotif.map((applicant) => (
                              <ComboboxOption
                                key={applicant.id}
                                className={({ active }) =>
                                  clsx(
                                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                    'relative cursor-default select-none py-3 pl-4 pr-9'
                                  )
                                }
                                value={applicant}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3", active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600")}>
                                        {applicant.applicant_name?.charAt(0) || '?'}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className={clsx(selected ? 'font-semibold' : 'font-medium', 'block truncate')}>
                                          {applicant.applicant_name}
                                        </span>
                                        <span className={clsx("text-xs", active ? "text-blue-100" : "text-gray-500")}>
                                          {applicant.applicant_email} ({applicant.job_title})
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
                      <label htmlFor="notif-title" className="block text-sm font-bold text-gray-700 mb-1.5">Judul Notifikasi</label>
                      <input
                        type="text"
                        id="notif-title"
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                        placeholder="Contoh: Jadwal Interview"
                        value={notificationData.title}
                        onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="notif-subject" className="block text-sm font-bold text-gray-700 mb-1.5">Subjek (Ringkas)</label>
                      <input
                        type="text"
                        id="notif-subject"
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                        placeholder="Contoh: Undangan Interview Tahap 1"
                        value={notificationData.subject}
                        onChange={(e) => setNotificationData({ ...notificationData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notif-message" className="block text-sm font-bold text-gray-700 mb-1.5">Isi Pesan</label>
                    <textarea
                      id="notif-message"
                      rows={6}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl p-3"
                      placeholder="Tulis pesan lengkap di sini..."
                      value={notificationData.message}
                      onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 text-right">Mendukung format teks biasa.</p>
                  </div>
                </>
              ) : (
                /* Step 2: Confirmation & Channel Selection */
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Ringkasan Pesan</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <p><span className="font-semibold text-gray-600">Penerima:</span> {notificationData.user?.applicant_name}</p>
                      <p><span className="font-semibold text-gray-600">Judul:</span> {notificationData.title}</p>
                      <p><span className="font-semibold text-gray-600">Subjek:</span> {notificationData.subject}</p>
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
                          <p className="text-gray-500">Kirim salinan pesan ke alamat email user ({notificationData.user?.applicant_email}).</p>
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
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50"
                    onClick={handleBackStep}
                    disabled={isSending}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50"
                    onClick={(e) => handleSendNotification(e)}
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
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50"
                    onClick={handleCloseNotificationModal}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl shadow-lg hover:bg-blue-700"
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

      {/* Detail Modal */}
      {
        isDetailModalOpen && selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleCloseDetailModal}></div>
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Lengkap Pelamar</h3>
                </div>
                <button onClick={handleCloseDetailModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-0 overflow-y-auto flex-1">
                {/* Header Info Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {selectedApplicant.applicant_photo ? (
                      <img
                        src={selectedApplicant.applicant_photo.startsWith('http') ? selectedApplicant.applicant_photo : `${window.API_BASE_URL}${selectedApplicant.applicant_photo}`}
                        alt={selectedApplicant.applicant_name}
                        className="w-32 h-32 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://ui-avatars.com/api/?name=" + selectedApplicant.applicant_name + "&background=FFFFFF&color=2563EB&bold=true";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/20 shadow-xl">
                        <User className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    <div className="text-center md:text-left">
                      <h4 className="text-3xl font-extrabold">{selectedApplicant.applicant_name}</h4>
                      <p className="text-blue-100 text-lg mb-2">{selectedApplicant.applicant_email}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 italic">
                          Posisi: {selectedApplicant.job_title}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 italic">
                          Status: {selectedApplicant.status?.trim() || 'Dalam Proses'}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 italic">
                          ID: #{selectedApplicant.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Data */}
                  <div className="space-y-6">
                    <section>
                      <h5 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" /> Data Pribadi
                      </h5>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">NIK</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_nik || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Telepon</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Tempat Lahir</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_birth_place || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Tanggal Lahir</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedApplicant.applicant_birth_date ? new Date(selectedApplicant.applicant_birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Agama</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_religion || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">TB / BB</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_height ? `${selectedApplicant.applicant_height} cm` : '-'} / {selectedApplicant.applicant_weight ? `${selectedApplicant.applicant_weight} kg` : '-'}</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h5 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Pendidikan & Keahlian
                      </h5>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Pendidikan Terakhir</p>
                            <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_last_education || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">IPK / Nilai</p>
                            <p className="text-sm font-medium text-gray-900 font-mono">{selectedApplicant.applicant_gpa || '-'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Jurusan</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApplicant.applicant_major || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Keahlian</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedApplicant.applicant_skills ? selectedApplicant.applicant_skills.split(',').map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 shadow-sm">
                                {skill.trim()}
                              </span>
                            )) : <p className="text-sm text-gray-400 italic">Belum mengisi keahlian</p>}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Address and Documents */}
                  <div className="space-y-6">
                    <section>
                      <h5 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Alamat
                      </h5>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5 text-blue-500 italic">Domisili</p>
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {selectedApplicant.applicant_domicile_address || '-'}
                            {(selectedApplicant.applicant_domicile_rt || selectedApplicant.applicant_domicile_rw) &&
                              ` (RT ${selectedApplicant.applicant_domicile_rt || '00'} / RW ${selectedApplicant.applicant_domicile_rw || '00'})`}
                            <br />
                            <span className="text-xs text-gray-500 font-bold italic">{selectedApplicant.applicant_domicile_kabupaten}</span>
                          </p>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5 text-blue-500 italic">KTP</p>
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {selectedApplicant.applicant_ktp_address || '-'}
                            {(selectedApplicant.applicant_ktp_rt || selectedApplicant.applicant_ktp_rw) &&
                              ` (RT ${selectedApplicant.applicant_ktp_rt || '00'} / RW ${selectedApplicant.applicant_ktp_rw || '00'})`}
                            <br />
                            <span className="text-xs text-gray-500 font-bold italic">{selectedApplicant.applicant_ktp_kabupaten}</span>
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h5 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Dokumen Pendukung
                      </h5>
                      <div className="space-y-3">
                        {selectedApplicant.cv_url ? (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.cv_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                                <FileText className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Curriculum Vitae (CV)</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        ) : (
                          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center gap-3 grayscale opacity-60">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500 italic">CV belum diunggah</span>
                          </div>
                        )}

                        {selectedApplicant.photo_url ? (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.photo_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Image className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Pas Foto Terbaru</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        ) : (
                          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center gap-3 grayscale opacity-60">
                            <Image className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500 italic">Pas Foto belum diunggah</span>
                          </div>
                        )}

                        {selectedApplicant.ktp_url ? (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.ktp_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <Image className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Foto KTP</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        ) : (
                          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center gap-3 grayscale opacity-60">
                            <Image className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500 italic">KTP belum diunggah</span>
                          </div>
                        )}

                        {selectedApplicant.ijazah_url ? (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.ijazah_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <Award className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Ijazah Terakhir</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        ) : (
                          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center gap-3 grayscale opacity-60">
                            <Award className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500 italic">Ijazah belum diunggah</span>
                          </div>
                        )}

                        {selectedApplicant.portfolio_url && (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.portfolio_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Layout className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Portofolio (File)</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        )}

                        {selectedApplicant.portfolio_link && (
                          <a
                            href={selectedApplicant.portfolio_link.startsWith('http') ? selectedApplicant.portfolio_link : `https://${selectedApplicant.portfolio_link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <LinkIcon className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Portofolio (Link)</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                          </a>
                        )}

                        {selectedApplicant.other_url && (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.other_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <FolderOpen className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Sertifikat Pendukung</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        )}

                        {selectedApplicant.paklaring_url && (
                          <a
                            href={`${window.API_BASE_URL}${selectedApplicant.paklaring_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all">
                                <ScrollText className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-gray-700">Surat Pengalaman Kerja (Paklaring)</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </a>
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                {selectedApplicant.psychotest_results && (
                  <div className="px-8 pb-8">
                    <section>
                      <h5 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Hasil Psikotes
                      </h5>
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-orange-900 italic uppercase">Skor: {selectedApplicant.psychotest_score} / 100</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-orange-100 text-sm font-medium text-gray-700 leading-relaxed font-sans">
                          {(() => {
                            try {
                              const results = typeof selectedApplicant.psychotest_results === 'string'
                                ? JSON.parse(selectedApplicant.psychotest_results)
                                : selectedApplicant.psychotest_results;

                              if (results && typeof results === 'object') {
                                return (
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center bg-orange-50/50 p-2 rounded-lg border border-orange-100/50 mb-2">
                                      <span className="text-orange-800 font-bold uppercase text-[10px] tracking-wider">Detail Jawaban</span>
                                      <span className={clsx(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
                                        results.status === 'Diskualifikasi' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                      )}>
                                        {results.status || 'Selesai'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Benar</p>
                                        <p className="text-lg font-black text-green-600">{results.correct_answers ?? 0}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Total Soal MC</p>
                                        <p className="text-lg font-black text-gray-700">{results.total_mc ?? 0}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            } catch (e) {
                              console.error("Format JSON tidak valid:", e);
                            }
                            return <span className="italic text-gray-400">{selectedApplicant.psychotest_results}</span>;
                          })()}
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-3">
                  {/* Stage-specific Buttons in Modal */}
                  {(!selectedApplicant.status || selectedApplicant.status?.trim() === 'Dikirim' || selectedApplicant.status?.trim() === 'Seleksi Administrasi' || selectedApplicant.status?.trim() === 'Administrasi') && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: 'status',
                          payload: { application_id: selectedApplicant.id, status: 'Tes Psikotes' },
                          message: 'Lanjutkan pelamar ini ke tahap Tes Psikotes?',
                          confirmText: 'Ya, Lanjut Psikotes',
                          confirmButtonClass: 'bg-green-600 hover:bg-green-700'
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-extrabold hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" /> Lanjut Psikotes
                    </button>
                  )}

                  {(selectedApplicant.status?.trim() === 'Tes Psikotes' || selectedApplicant.status?.trim() === 'Psikotes') && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: 'status',
                          payload: { application_id: selectedApplicant.id, status: 'Interview' },
                          message: 'Lanjutkan pelamar ini ke tahap Interview? \n\nSistem akan mengirimkan notifikasi otomatis.',
                          confirmText: 'Ya, Lanjut Interview',
                          confirmButtonClass: 'bg-purple-600 hover:bg-purple-700'
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-sm font-extrabold hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" /> Lanjut Interview
                    </button>
                  )}

                  {selectedApplicant.status?.trim() === 'Interview' && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: 'status',
                          payload: {
                            application_id: selectedApplicant.id,
                            status: 'Final',
                            action: 'accept'
                          },
                          message: 'Apakah Anda yakin ingin MENERIMA pelamar ini sebagai karyawan baru?',
                          confirmText: 'Ya, Terima',
                          confirmButtonClass: 'bg-emerald-600 hover:bg-emerald-700'
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-extrabold hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" /> Terima Pelamar
                    </button>
                  )}

                  {/* Universal Reject in Modal */}
                  {selectedApplicant.status?.trim() !== 'Ditolak' && selectedApplicant.status?.trim() !== 'Diterima' && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: 'status',
                          payload: {
                            application_id: selectedApplicant.id,
                            status: selectedApplicant.status || 'Administrasi',
                            action: 'reject'
                          },
                          message: 'Apakah Anda yakin ingin menolak pelamar ini?',
                          confirmText: 'Ya, Tolak',
                          confirmButtonClass: 'bg-rose-600 hover:bg-rose-700'
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-extrabold hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <XCircle className="w-4 h-4" /> Tolak Pelamar
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  onClick={handleCloseDetailModal}
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

export default AdminApplicants;