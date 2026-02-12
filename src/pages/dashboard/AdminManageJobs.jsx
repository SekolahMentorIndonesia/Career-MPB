import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, X, ChevronsUpDown, MapPin, Users, Check, Building2, Calendar, FileText, Send, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import clsx from 'clsx';

// Helper Component for Form Groups
const FormGroup = ({ label, icon: Icon, children, hint }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const DateRangeInput = ({ label, startValue, onStartChange, endValue, onEndChange, icon: Icon }) => (
  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
    <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Mulai</label>
        <input
          type="date"
          className="block w-full px-3 py-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          value={startValue}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Selesai</label>
        <input
          type="date"
          className="block w-full px-3 py-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          value={endValue}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </div>
  </div>
);

const jobTypes = ['Fulltime', 'Parttime', 'Contract', 'Magang/PKL'];
const targetAudiences = ['Umum (Semua Jenjang)', 'Fresh Graduate', 'Experienced', 'Magang/PKL'];

const AdminManageJobs = () => {
  const { showNotification } = useNotification();
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobStartDate, setNewJobStartDate] = useState('');
  const [newJobEndDate, setNewJobEndDate] = useState('');
  const [newJobTargetAudience, setNewJobTargetAudience] = useState('Umum (Semua Jenjang)');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobRegStartDate, setNewJobRegStartDate] = useState('');
  const [newJobRegEndDate, setNewJobRegEndDate] = useState('');
  const [newJobPsyStartDate, setNewJobPsyStartDate] = useState('');
  const [newJobPsyEndDate, setNewJobPsyEndDate] = useState('');
  const [newJobIntStartDate, setNewJobIntStartDate] = useState('');
  const [newJobIntEndDate, setNewJobIntEndDate] = useState('');
  const [newJobAnnounceDate, setNewJobAnnounceDate] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsAddJobModalOpen(true);
    // Clear form fields when opening modal
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobType('');
    setNewJobDescription('');
    setNewJobStartDate('');
    setNewJobEndDate('');
    setNewJobTargetAudience('Umum (Semua Jenjang)');
    setNewJobLocation('');
    setNewJobRegStartDate('');
    setNewJobRegEndDate('');
    setNewJobPsyStartDate('');
    setNewJobPsyEndDate('');
    setNewJobIntStartDate('');
    setNewJobIntEndDate('');
    setNewJobAnnounceDate('');
    setEditingJob(null);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJobTitle(job.title);
    setNewJobCompany(job.company);
    setNewJobType(job.type);
    setNewJobDescription(job.description);
    setNewJobTargetAudience(job.target_audience);
    setNewJobLocation(job.location);
    setNewJobRegStartDate(job.registration_start_date ? job.registration_start_date.split(' ')[0] : '');
    setNewJobRegEndDate(job.registration_end_date ? job.registration_end_date.split(' ')[0] : '');
    setNewJobPsyStartDate(job.psytest_start_date ? job.psytest_start_date.split(' ')[0] : '');
    setNewJobPsyEndDate(job.psytest_end_date ? job.psytest_end_date.split(' ')[0] : '');
    setNewJobIntStartDate(job.interview_start_date ? job.interview_start_date.split(' ')[0] : '');
    setNewJobIntEndDate(job.interview_end_date ? job.interview_end_date.split(' ')[0] : '');
    setNewJobAnnounceDate(job.announcement_date ? job.announcement_date.split(' ')[0] : '');
    setIsAddJobModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setJobToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/jobs/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil!', 'Lowongan telah dihapus.');
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
        fetchJobs();
      } else {
        showNotification('error', 'Gagal!', data.message || 'Gagal menghapus lowongan');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi.');
    }
  };

  const handleCloseModal = () => {
    setIsAddJobModalOpen(false);
  };

  const handleAddJob = async () => {
    if (isSubmitting) return;

    const jobData = {
      title: newJobTitle,
      company: newJobCompany,
      type: newJobType,
      description: newJobDescription,
      target_audience: newJobTargetAudience,
      location: newJobLocation,
      registration_start_date: newJobRegStartDate,
      registration_end_date: newJobRegEndDate,
      psytest_start_date: newJobPsyStartDate,
      psytest_end_date: newJobPsyEndDate,
      interview_start_date: newJobIntStartDate,
      interview_end_date: newJobIntEndDate,
      announcement_date: newJobAnnounceDate,
    };

    const url = editingJob
      ? `${window.API_BASE_URL}/api/jobs/${editingJob.id}`
      : `${window.API_BASE_URL}/api/jobs`;

    const method = editingJob ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil!', editingJob ? 'Lowongan telah diperbarui.' : 'Lowongan pekerjaan baru telah berhasil ditambahkan.');
        handleCloseModal();
        fetchJobs(); // Realtime update
      } else {
        showNotification('error', 'Gagal!', data.message || 'Gagal menambahkan lowongan');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      showNotification('error', 'Koneksi Gagal', 'Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Lowongan</h1>
          <p className="text-gray-600">Buat dan atur lowongan pekerjaan baru.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Tambah Lowongan
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perusahaan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode Daftar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Briefcase className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-lg font-medium text-gray-700">Belum ada lowongan dibuat</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{j.title}</div>
                      <div className="text-xs text-gray-500">{j.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{j.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        j.type === 'Fulltime' ? 'bg-indigo-100 text-indigo-700' :
                          j.type === 'Magang/PKL' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                      )}>
                        {j.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 font-medium">
                        {j.registration_start_date ? new Date(j.registration_start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                        {' - '}
                        {j.registration_end_date ? new Date(j.registration_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditJob(j)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(j.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold">Belum ada lowongan</p>
            </div>
          ) : (
            jobs.map((j) => (
              <div key={j.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-900 leading-tight">{j.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {j.company}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {j.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                      j.type === 'Fulltime' ? 'bg-indigo-100 text-indigo-700' :
                        j.type === 'Magang/PKL' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                    )}>
                      {j.type}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Periode Pendaftaran</p>
                    <p className="text-xs font-bold text-gray-700">
                      {j.registration_start_date ? new Date(j.registration_start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                      {' - '}
                      {j.registration_end_date ? new Date(j.registration_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEditJob(j)}
                      className="p-2 bg-white text-blue-600 border border-blue-100 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(j.id)}
                      className="p-2 bg-white text-red-600 border border-red-100 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <Transition
            show={isAddJobModalOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          </Transition>

          <Transition
            show={isAddJobModalOpen}
            enter="transform transition ease-in-out duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative w-screen max-w-lg bg-white shadow-2xl h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {editingJob ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {editingJob ? 'Perbarui informasi pekerjaan ini.' : 'Lengkapi informasi pekerjaan dengan detail.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                  onClick={handleCloseModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
                {/* Section 1: Detail Pekerjaan */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="text-md font-black text-gray-900 tracking-wide uppercase">Detail Pekerjaan</h4>
                  </div>

                  <div className="grid gap-5">
                    <FormGroup label="Posisi / Judul Pekerjaan" icon={Briefcase} hint="Gunakan judul yang spesifik (mis: Senior Backend Engineer)">
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                        placeholder="Contoh: Staff Administrasi"
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup label="Nama Perusahaan" icon={Building2}>
                      <input
                        type="text"
                        className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                        placeholder="PT Multiusaha Prioritas Bersama"
                        value={newJobCompany}
                        onChange={(e) => setNewJobCompany(e.target.value)}
                      />
                    </FormGroup>

                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Tipe Pekerjaan">
                        <Listbox value={newJobType} onChange={setNewJobType}>
                          <div className="relative">
                            <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-left text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none">
                              <span className="block truncate font-medium">{newJobType || 'Pilih Tipe'}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                              </span>
                            </ListboxButton>
                            <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                              <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                                {jobTypes.map((type) => (
                                  <ListboxOption
                                    key={type}
                                    className={({ active }) => clsx(active ? 'bg-blue-50 text-blue-700' : 'text-gray-900', 'relative cursor-pointer select-none py-2.5 pl-4 pr-9')}
                                    value={type}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span className={clsx(selected ? 'font-bold' : 'font-normal', 'block truncate')}>{type}</span>
                                        {selected && (
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                            <Check className="h-4 w-4" />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </Transition>
                          </div>
                        </Listbox>
                      </FormGroup>

                      <FormGroup label="Target Peserta">
                        <Listbox value={newJobTargetAudience} onChange={setNewJobTargetAudience}>
                          <div className="relative">
                            <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-left text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none">
                              <span className="block truncate font-medium">{newJobTargetAudience}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                              </span>
                            </ListboxButton>
                            <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                              <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                                {targetAudiences.map((audience) => (
                                  <ListboxOption
                                    key={audience}
                                    className={({ active }) => clsx(active ? 'bg-blue-50 text-blue-700' : 'text-gray-900', 'relative cursor-pointer select-none py-2.5 pl-4 pr-9')}
                                    value={audience}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span className={clsx(selected ? 'font-bold' : 'font-normal', 'block truncate')}>{audience}</span>
                                        {selected && (
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                            <Check className="h-4 w-4" />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </Transition>
                          </div>
                        </Listbox>
                      </FormGroup>
                    </div>

                    <FormGroup label="Lokasi Penempatan" icon={MapPin}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                          placeholder="Contoh: Bekasi, Jawa Barat"
                          value={newJobLocation}
                          onChange={(e) => setNewJobLocation(e.target.value)}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup label="Deskripsi Pekerjaan" icon={FileText}>
                      <textarea
                        rows="6"
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                        placeholder="Jelaskan kualifikasi, tanggung jawab, dan Benefit yang ditawarkan..."
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                      ></textarea>
                    </FormGroup>
                  </div>
                </section>

                {/* Section 2: Jadwal Seleksi */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h4 className="text-md font-black text-gray-900 tracking-wide uppercase">Jadwal Seleksi</h4>
                  </div>

                  <div className="space-y-4">
                    <DateRangeInput
                      label="1. Registrasi & Administrasi"
                      icon={Users}
                      startValue={newJobRegStartDate}
                      onStartChange={setNewJobRegStartDate}
                      endValue={newJobRegEndDate}
                      onEndChange={setNewJobRegEndDate}
                    />
                    <DateRangeInput
                      label="2. Tes Psikotes"
                      icon={FileText}
                      startValue={newJobPsyStartDate}
                      onStartChange={setNewJobPsyStartDate}
                      endValue={newJobPsyEndDate}
                      onEndChange={setNewJobPsyEndDate}
                    />
                    <DateRangeInput
                      label="3. Interview User & HR"
                      icon={Users}
                      startValue={newJobIntStartDate}
                      onStartChange={setNewJobIntStartDate}
                      endValue={newJobIntEndDate}
                      onEndChange={setNewJobIntEndDate}
                    />

                    <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                        <Send className="w-4 h-4 text-emerald-600" />
                        4. Pengumuman Hasil Akhir
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Tanggal Pengumuman</label>
                        <input
                          type="date"
                          className="block w-full px-3 py-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                          value={newJobAnnounceDate}
                          onChange={(e) => setNewJobAnnounceDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t bg-gray-50/50 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className={clsx(
                    "px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-lg flex items-center gap-2",
                    isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  )}
                  onClick={handleAddJob}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Lowongan'
                  )}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Hapus Lowongan?"
        message="Tindakan ini tidak dapat dibatalkan. Lowongan yang dihapus akan hilang dari sistem secara permanen."
        onConfirm={handleDeleteJob}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Hapus Sekarang"
        cancelText="Batal"
      />
    </div>
  );
};

export default AdminManageJobs;
