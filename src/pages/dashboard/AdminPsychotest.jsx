import React, { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, Clock, Users, FileText, BarChart, Search, ChevronsUpDown, Link as LinkIcon, Copy, Check, Loader2, Trash2, Plus, Save, PencilLine, X, Eye } from 'lucide-react';
import clsx from 'clsx';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminPsychotest = () => {
  const [activeTab, setActiveTab] = useState('participants');
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedLinkForUser, setGeneratedLinkForUser] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  // Question Bank States
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [settings, setSettings] = useState({
    use_multiple_choice: '1',
    multiple_choice_count: '10',
    use_essay: '1',
    essay_count: '2',
    test_duration_minutes: '60'
  });
  const [summaryData, setSummaryData] = useState(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Add Question Modal
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    answer_key: ''
  });

  // Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);


  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const psicotesParticipants = data.data.filter(app =>
          ['Tes Psikotes', 'Psikotes', 'Interview', 'Diterima', 'Ditolak'].includes(app.status)
        );
        setParticipants(psicotesParticipants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Question Bank Logic ---

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/questions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/summary`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setSummaryData(data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/settings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'participants') fetchParticipants();
    if (activeTab === 'questions') {
      fetchQuestions();
      fetchSettings();
    }
    if (activeTab === 'summary') fetchSummary();
  }, [activeTab]);

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings })
      });
      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', 'Pengaturan berhasil disimpan');
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    // Validation
    if (!newQuestionData.question) return alert("Pertanyaan wajib diisi");
    if (newQuestionData.type === 'multiple_choice') {
      if (newQuestionData.options.some(opt => !opt)) return alert("Semua opsi jawaban harus diisi");
      if (!newQuestionData.answer_key) return alert("Kunci jawaban harus dipilih");
    }

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQuestionData)
      });
      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', 'Soal berhasil ditambahkan');
        setIsAddQuestionModalOpen(false);
        fetchQuestions();
        setNewQuestionData({ type: 'multiple_choice', question: '', options: ['', '', '', ''], answer_key: '' });
      } else {
        showNotification('error', 'Gagal', data.message);
      }
    } catch (error) {
      console.error(error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/admin/psychotest/questions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id: questionToDelete.id })
      });
      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil', 'Soal berhasil dihapus');
        fetchQuestions();
      } else {
        showNotification('error', 'Gagal', data.message);
      }
    } catch (error) {
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    } finally {
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    }
  };

  // --- End Question Bank Logic ---

  const handleGenerateLink = () => {
    setIsUserSelectionModalOpen(true);
    setSelectedUser(null);
    setGeneratedLinkForUser('');
  };

  const handleCloseUserSelectionModal = () => {
    setIsUserSelectionModalOpen(false);
    setSelectedUser(null);
    setGeneratedLinkForUser('');
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerateLinkForUser = async () => {
    if (selectedUser) {
      const code = generateRandomCode();
      const link = `${window.location.origin}/test-psikotes/${code}?app=${selectedUser.id}`;

      try {
        const response = await fetch(`http://${window.location.hostname}:8000/api/applications/generate-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ application_id: selectedUser.id, link: link })
        });

        const data = await response.json();
        if (data.success) {
          setGeneratedLinkForUser(link);
          fetchParticipants();
          showNotification('success', 'Link Terkirim', 'Link berhasil dibuat dan notifikasi telah dikirim ke user!');
        } else {
          showNotification('error', 'Gagal', data.message || 'Gagal generate link');
        }
      } catch (error) {
        console.error('Error generating link:', error);
        showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
      }
    } else {
      showNotification('info', 'Peserta Kosong', 'Pilih peserta terlebih dahulu!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Psikotes</h1>
          <p className="text-gray-600">Atur soal dan pantau peserta psikotes</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('participants')}
              className={clsx(
                activeTab === 'participants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <Users className={clsx(activeTab === 'participants' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5')} />
              <span>Daftar Peserta</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={clsx(
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <FileText className={clsx(activeTab === 'questions' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5')} />
              <span>Bank Soal</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={clsx(
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <BarChart className={clsx(activeTab === 'summary' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5')} />
              <span>Ringkasan</span>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'participants' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari peserta..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleGenerateLink}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Link
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-10 text-gray-500">
                  <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-2" />
                  <p>Memuat data peserta...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada peserta pada tahap psikotes.</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Aplikasi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil Akhir</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div>{participant.applicant_name}</div>
                            <div className="text-xs text-gray-500 font-normal">{participant.applicant_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-xs">{participant.job_title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{participant.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {participant.psychotest_results ? (
                              <span className={clsx(
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                participant.psychotest_score >= 70 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              )}>
                                {participant.psychotest_score} (Grade: {participant.psychotest_results})
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4"><User className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Settings Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Konfigurasi Tes</h3>
                    <p className="text-sm text-gray-500">Atur komposisi dan durasi tes psikotes</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.open(`${window.location.origin}/test-psikotes/demo?mode=preview`, '_blank');
                      }}
                      className="flex items-center text-sm bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm font-bold"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Uji Coba Tes
                    </button>
                    {isEditingSettings ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditingSettings(false);
                            fetchSettings(); // Reset changes
                          }}
                          className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </button>
                        <button
                          onClick={async () => {
                            await handleUpdateSettings();
                            setIsEditingSettings(false);
                          }}
                          className="flex items-center text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditingSettings(true)}
                        className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <PencilLine className="w-4 h-4 mr-2" />
                        Edit Pengaturan
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Duration Setting */}
                  <div className="md:col-span-2">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Durasi Pengerjaan</label>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                        type="number"
                        id="duration"
                        disabled={!isEditingSettings}
                        value={settings.test_duration_minutes}
                        onChange={(e) => setSettings({ ...settings, test_duration_minutes: e.target.value })}
                        className={clsx(
                          "w-24 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                          !isEditingSettings ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300"
                        )}
                      />
                      <span className="ml-2 text-gray-600 font-medium">Menit</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Waktu maksimal yang diberikan kepada peserta untuk menyelesaikan seluruh soal.</p>
                  </div>

                  <hr className="md:col-span-2 border-gray-100" />

                  {/* Multiple Choice Settings */}
                  <div className={clsx("p-4 rounded-lg border transition-all", settings.use_multiple_choice === '1' ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200")}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          id="multiple-choice"
                          type="checkbox"
                          disabled={!isEditingSettings}
                          className={clsx("h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded", !isEditingSettings && "cursor-not-allowed opacity-60")}
                          checked={settings.use_multiple_choice === '1'}
                          onChange={(e) => setSettings({ ...settings, use_multiple_choice: e.target.checked ? '1' : '0' })}
                        />
                        <label htmlFor="multiple-choice" className="font-semibold text-gray-800">Pilihan Ganda</label>
                      </div>
                      <div className={clsx("p-2 rounded-full", settings.use_multiple_choice === '1' ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400")}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>

                    {settings.use_multiple_choice === '1' && (
                      <div className="ml-8 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label htmlFor="mc-count" className="block text-sm text-gray-600 mb-1">Jumlah Soal Ditampilkan:</label>
                        <input
                          type="number"
                          id="mc-count"
                          disabled={!isEditingSettings}
                          value={settings.multiple_choice_count}
                          onChange={(e) => setSettings({ ...settings, multiple_choice_count: e.target.value })}
                          className={clsx(
                            "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            !isEditingSettings ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300"
                          )}
                        />
                        <p className="text-xs text-gray-500 mt-1">Soal akan dipilih secara acak dari bank soal.</p>
                      </div>
                    )}
                  </div>

                  {/* Essay Settings */}
                  <div className={clsx("p-4 rounded-lg border transition-all", settings.use_essay === '1' ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200")}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          id="essay"
                          type="checkbox"
                          disabled={!isEditingSettings}
                          className={clsx("h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded", !isEditingSettings && "cursor-not-allowed opacity-60")}
                          checked={settings.use_essay === '1'}
                          onChange={(e) => setSettings({ ...settings, use_essay: e.target.checked ? '1' : '0' })}
                        />
                        <label htmlFor="essay" className="font-semibold text-gray-800">Esai / Uraian</label>
                      </div>
                      <div className={clsx("p-2 rounded-full", settings.use_essay === '1' ? "bg-purple-100 text-purple-600" : "bg-gray-200 text-gray-400")}>
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>

                    {settings.use_essay === '1' && (
                      <div className="ml-8 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label htmlFor="essay-count" className="block text-sm text-gray-600 mb-1">Jumlah Soal Ditampilkan:</label>
                        <input
                          type="number"
                          id="essay-count"
                          disabled={!isEditingSettings}
                          value={settings.essay_count}
                          onChange={(e) => setSettings({ ...settings, essay_count: e.target.value })}
                          className={clsx(
                            "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            !isEditingSettings ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300"
                          )}
                        />
                        <p className="text-xs text-gray-500 mt-1">Soal akan dipilih secara acak dari bank soal.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Lists */}
              <div className="grid grid-cols-1 gap-6">

                {/* Multiple Choice Section */}
                {settings.use_multiple_choice === '1' && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Bank Soal Pilihan Ganda</h3>
                      <button
                        onClick={() => {
                          setNewQuestionData({ type: 'multiple_choice', question: '', options: ['', '', '', ''], answer_key: '' });
                          setIsAddQuestionModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Tambah Soal
                      </button>
                    </div>

                    {questions.filter(q => q.type === 'multiple_choice').length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-900">Belum ada soal pilihan ganda</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {questions.filter(q => q.type === 'multiple_choice').map((q, idx) => (
                          <li key={q.id} className="bg-gray-50 border rounded-md p-3 relative group">
                            <div className="pr-8">
                              <p className="font-medium text-gray-900 text-sm mb-2">{idx + 1}. {q.question}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 ml-4">
                                {q.options && q.options.map((opt, i) => (
                                  <div key={i} className={clsx(opt === q.answer_key ? "text-green-600 font-bold" : "")}>
                                    {String.fromCharCode(65 + i)}. {opt}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => { setQuestionToDelete(q); setIsDeleteModalOpen(true); }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Essay Section */}
                {settings.use_essay === '1' && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Bank Soal Esai</h3>
                      <button
                        onClick={() => {
                          setNewQuestionData({ type: 'essay', question: '', options: null, answer_key: null });
                          setIsAddQuestionModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Tambah Soal
                      </button>
                    </div>

                    {questions.filter(q => q.type === 'essay').length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-900">Belum ada soal esai</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {questions.filter(q => q.type === 'essay').map((q, idx) => (
                          <li key={q.id} className="bg-gray-50 border rounded-md p-3 relative group">
                            <p className="font-medium text-gray-900 text-sm">{idx + 1}. {q.question}</p>
                            <button
                              onClick={() => { setQuestionToDelete(q); setIsDeleteModalOpen(true); }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
          }

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Peserta</p>
                  <p className="text-3xl font-bold text-gray-900">{summaryData?.total_participants || 0}</p>
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Mengerjakan Soal</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Rata-rata Skor</p>
                  <p className="text-3xl font-bold text-gray-900">{summaryData?.average_score || 0}</p>
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <BarChart className="w-3 h-3 mr-1" />
                    <span>Poin Pilihan Ganda</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Distribusi Grade</p>
                  <div className="flex gap-2 mt-2">
                    {['A', 'B', 'C', 'D', 'E'].map(grade => (
                      <div key={grade} className="flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 mb-1">{grade}</span>
                        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                          <div
                            className={clsx("h-full", grade === 'A' ? "bg-green-500" : (grade === 'E' ? "bg-red-500" : "bg-blue-500"))}
                            style={{ width: summaryData?.breakdown?.[grade] ? `${(summaryData.breakdown[grade] / summaryData.total_participants) * 100}%` : '0%' }}
                          ></div>
                        </div>
                        <span className="mt-1 text-[10px] text-gray-500">{summaryData?.breakdown?.[grade] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Hasil Detail Peserta</h3>
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.filter(p => p.score !== null).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500 italic">Belum ada peserta yang menyelesaikan tes</td>
                        </tr>
                      ) : (
                        participants.filter(p => p.score !== null).map((p, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.user_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={clsx(
                                "px-2.5 py-0.5 rounded-full text-xs font-bold",
                                p.results === 'A' ? "bg-green-100 text-green-700" : (p.results === 'E' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700")
                              )}>
                                Grade {p.results}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(p.created_at).toLocaleDateString('id-ID')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Question Modal */}
        {
          isAddQuestionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddQuestionModalOpen(false)}></div>
              <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl p-6">
                <h3 className="text-lg font-bold mb-4">Tambah Soal {newQuestionData.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Esai'}</h3>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      value={newQuestionData.question}
                      onChange={(e) => setNewQuestionData({ ...newQuestionData, question: e.target.value })}
                      required
                    />
                  </div>

                  {newQuestionData.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Opsi Jawaban & Kunci</label>
                      {newQuestionData.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="answer_key"
                            checked={newQuestionData.answer_key === opt && opt !== ''}
                            onChange={() => setNewQuestionData({ ...newQuestionData, answer_key: opt })}
                            disabled={!opt}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="w-6 text-sm font-bold text-gray-500">{String.fromCharCode(65 + i)}.</span>
                          <input
                            type="text"
                            className="flex-1 border rounded-md p-1.5 text-sm"
                            placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...newQuestionData.options];
                              newOptions[i] = e.target.value;
                              setNewQuestionData({ ...newQuestionData, options: newOptions });
                              // Reset answer key if the selected option text changes (optional UX choice)
                            }}
                            required
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">* Pilih radio button di sebelah kiri untuk menandai kunci jawaban benar.</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 gap-2">
                    <button type="button" onClick={() => setIsAddQuestionModalOpen(false)} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Simpan Soal</button>
                  </div>
                </form>
              </div>
            </div>
          )
        }

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Hapus Soal"
          message="Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Hapus"
          onConfirm={handleDeleteQuestion}
        />

        {/* User Selection Modal */}
        {
          isUserSelectionModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsUserSelectionModalOpen(false)}></div>
              <div className="relative w-full max-w-md bg-white shadow-lg h-full overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Pilih Peserta untuk Generate Link</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsUserSelectionModalOpen(false)}
                  >
                    <span className="sr-only">Tutup</span>
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <Listbox value={selectedUser} onChange={setSelectedUser}>
                      <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                          <span className="block truncate">
                            {selectedUser ? `${selectedUser.applicant_name} (${selectedUser.applicant_email})` : 'Pilih peserta...'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {participants.filter(p => p.status === 'Tes Psikotes' || p.status === 'Psikotes').map((user) => (
                            <ListboxOption
                              key={user.id}
                              className={({ active }) =>
                                clsx(
                                  active ? 'text-white bg-blue-600' : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={user}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {user.applicant_name} ({user.job_title})
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
                      </div>
                    </Listbox>
                  </div>

                  {generatedLinkForUser && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1 truncate mr-4">
                        <p className="text-sm font-medium text-blue-800">Link Psikotes:</p>
                        <p className="text-sm text-blue-600 truncate">{generatedLinkForUser}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedLinkForUser)}
                        className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Salin Link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <button
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleGenerateLinkForUser}
                  >
                    Generate Link
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AdminPsychotest;
