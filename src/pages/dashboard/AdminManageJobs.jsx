import React, { useState } from 'react';
import { Briefcase, Plus, X, ChevronsUpDown, MapPin, Users, Check } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import clsx from 'clsx';

const jobTypes = ['Fulltime', 'Parttime', 'Contract', 'Internship'];
const targetAudiences = ['Umum (Semua Jenjang)', 'Fresh Graduate', 'Experienced'];

const AdminManageJobs = () => {
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
  };

  const handleCloseModal = () => {
    setIsAddJobModalOpen(false);
  };

  const handleAddJob = () => {
    console.log('Adding new job:', {
      newJobTitle,
      newJobCompany,
      newJobType,
      newJobDescription,
      newJobStartDate,
      newJobEndDate,
      newJobTargetAudience,
      newJobLocation,
      newJobRegStartDate,
      newJobRegEndDate,
      newJobPsyStartDate,
      newJobPsyEndDate,
      newJobIntStartDate,
      newJobIntEndDate,
      newJobAnnounceDate,
    });
    // Here you would typically send this data to your backend
    handleCloseModal();
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

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="overflow-x-auto">
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
              {/* Placeholder for no jobs */}
              <tr>
                <td colSpan="6" className="px-6 py-12 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-700">Belum ada lowongan dibuat</p>
                    <p className="text-sm text-gray-500">Silakan buat lowongan baru untuk memulai proses rekrutmen.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-md bg-white shadow-lg h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tambah Lowongan Baru</h3>
                <p className="text-sm text-gray-500">Isi detail lowongan dan jadwal seleksi.</p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <span className="sr-only">Tutup</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  Detail Pekerjaan
                </h4>
              <div className="mb-4">
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">
                  Posisi / Judul Pekerjaan
                </label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Contoh: Staff Administrasi"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="job-company" className="block text-sm font-medium text-gray-700">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  name="job-company"
                  id="job-company"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="PT Multiusaha Prioritas Bersama"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">
                    Tipe Pekerjaan
                  </label>
                  <Listbox value={newJobType} onChange={setNewJobType}>
                    {({ open }) => (
                      <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                          <span className="block truncate">{newJobType || 'Pilih Tipe Pekerjaan'}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <Transition
                          show={open}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {jobTypes.map((type) => (
                              <ListboxOption
                                key={type}
                                className={({ active }) =>
                                  clsx(
                                    active ? 'text-white bg-blue-600' : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={type}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                      {type}
                                    </span>
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
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    )}
                  </Listbox>
                </div>
                <div>
                  <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700">
                    Target Peserta
                  </label>
                  <Listbox value={newJobTargetAudience} onChange={setNewJobTargetAudience}>
                    {({ open }) => (
                      <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                          <span className="block truncate">{newJobTargetAudience}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <Transition
                          show={open}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {targetAudiences.map((audience) => (
                              <ListboxOption
                                key={audience}
                                className={({ active }) =>
                                  clsx(
                                    active ? 'text-white bg-blue-600' : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={audience}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                      {audience}
                                    </span>
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
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    )}
                  </Listbox>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="job-location" className="block text-sm font-medium text-gray-700">
                  Lokasi Penempatan
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="job-location"
                    id="job-location"
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Bekasi"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="job-description"
                  id="job-description"
                  rows="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Jelaskan tanggung jawab dan kualifikasi..."
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Jadwal Seleksi</h4>
                <div className="space-y-4">
                  {/* Registrasi & Administrasi */}
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        1
                      </span>
                      <h5 className="font-medium text-gray-900">Registrasi & Administrasi</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-start-date" className="block text-sm font-medium text-gray-700">
                          Mulai
                        </label>
                        <input
                          type="date"
                          name="reg-start-date"
                          id="reg-start-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobRegStartDate}
                          onChange={(e) => setNewJobRegStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-end-date" className="block text-sm font-medium text-gray-700">
                          Selesai
                        </label>
                        <input
                          type="date"
                          name="reg-end-date"
                          id="reg-end-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobRegEndDate}
                          onChange={(e) => setNewJobRegEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tes Psikotes */}
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        2
                      </span>
                      <h5 className="font-medium text-gray-900">Tes Psikotes</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="psy-start-date" className="block text-sm font-medium text-gray-700">
                          Mulai
                        </label>
                        <input
                          type="date"
                          name="psy-start-date"
                          id="psy-start-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobPsyStartDate}
                          onChange={(e) => setNewJobPsyStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="psy-end-date" className="block text-sm font-medium text-gray-700">
                          Selesai
                        </label>
                        <input
                          type="date"
                          name="psy-end-date"
                          id="psy-end-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobPsyEndDate}
                          onChange={(e) => setNewJobPsyEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interview User & HR */}
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        3
                      </span>
                      <h5 className="font-medium text-gray-900">Interview User & HR</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="int-start-date" className="block text-sm font-medium text-gray-700">
                          Mulai
                        </label>
                        <input
                          type="date"
                          name="int-start-date"
                          id="int-start-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobIntStartDate}
                          onChange={(e) => setNewJobIntStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="int-end-date" className="block text-sm font-medium text-gray-700">
                          Selesai
                        </label>
                        <input
                          type="date"
                          name="int-end-date"
                          id="int-end-date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newJobIntEndDate}
                          onChange={(e) => setNewJobIntEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pengumuman Hasil Akhir */}
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        4
                      </span>
                      <h5 className="font-medium text-gray-900">Pengumuman Hasil Akhir</h5>
                    </div>
                    <div>
                      <label htmlFor="announce-date" className="block text-sm font-medium text-gray-700">
                        Tanggal Pengumuman
                      </label>
                      <input
                        type="date"
                        name="announce-date"
                        id="announce-date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newJobAnnounceDate}
                        onChange={(e) => setNewJobAnnounceDate(e.target.value)}
                      />
                    </div>
                  </div>
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
                onClick={handleAddJob}
              >
                Tambah Lowongan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageJobs;
