import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, CheckCircle2, ChevronLeft, ChevronRight, Grid, LayoutGrid, ShieldAlert, Ban, HelpCircle, Brain } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import clsx from 'clsx';

const UserPsychotestExam = () => {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const appId = queryParams.get('app');
  const isPreview = queryParams.get('mode') === 'preview';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cheatCount, setCheatCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [isFullscreenRequired, setIsFullscreenRequired] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const lastViolationTime = useRef(0);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const url = isPreview
          ? `${window.API_BASE_URL}/api/psychotest/preview`
          : `${window.API_BASE_URL}/api/psychotest/test?app_id=${appId}`;

        const headers = isPreview
          ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          : {};

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.success) {
          setTestData(data.data);
          setTimeLeft(data.data.duration * 60);
        } else {
          setError(data.message || "Gagal memuat data ujian");
        }
      } catch (err) {
        setError("Kesalahan koneksi internet");
      } finally {
        setIsLoading(false);
      }
    };

    if (isPreview || appId) {
      fetchTest();
    } else {
      setError("Akses tidak valid (ID Aplikasi tidak ditemukan)");
      setIsLoading(false);
    }

    // Cleanup: Ensure fullscreen is exited when leaving the page
    return () => {
      exitFullscreen();
    };
  }, [appId]);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !isDisqualified) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && examStarted && !isDisqualified) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, isDisqualified]);

  // Anti-Cheat Detectors
  useEffect(() => {
    // We allow anti-cheat in preview mode for admin testing
    if (!examStarted || finished || isDisqualified || isSubmitting) return;

    const handleViolation = (type = "focus") => {
      const now = Date.now();
      // Prevent double counting within 1 second
      if (now - lastViolationTime.current < 1000) return;
      lastViolationTime.current = now;

      setCheatCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setIsDisqualified(true);
          if (!isPreview) handleDisqualify();
          return newCount;
        }
        setShowWarning(true);
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("visibility");
      }
    };

    const handleBlur = () => {
      handleViolation("blur");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && examStarted && !finished && !isDisqualified && !isSubmitting) {
        setIsFullscreenRequired(true);
        handleViolation("fullscreen");
      } else {
        setIsFullscreenRequired(false);
      }
    };

    const handlePreventShortcuts = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+C, Ctrl+P, Alt+Tab
      const forbiddenKeys = ['F12', 'u', 'i', 's', 'c', 'p'];
      if (
        forbiddenKeys.includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey) ||
        e.key === 'F12' ||
        (e.key === 'i' && e.ctrlKey && e.shiftKey) ||
        (e.key === 'j' && e.ctrlKey && e.shiftKey)
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handlePreventShortcuts);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handlePreventShortcuts);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [examStarted, finished, isDisqualified, isPreview, isSubmitting]);

  const handleDisqualify = async () => {
    setIsSubmitting(true);
    exitFullscreen();
    try {
      // Send disqualification to backend
      await fetch(`${window.API_BASE_URL}/api/psychotest/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          psychotest_id: testData.psychotest_id,
          answers: [],
          status: 'Disqualified',
          note: 'Otomatis diskualifikasi karena melanggar aturan (keluar tab/aplikasi > 2x)'
        })
      });
    } catch (err) {
      console.error("Failed to sync disqualification:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleStartExam = () => {
    // Request Fullscreen for CBT Experience
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.warn("Fullscreen error:", err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    setExamStarted(true);
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    exitFullscreen();

    if (isPreview) {
      // For preview mode, we still want to call the real submit API
      // to get the actual score calculation, even if it's not saved.
    }

    try {
      // Format answers for backend - Include all questions from testData to ensure correct score denominator
      const formattedAnswers = testData.questions.map(q => ({
        question_id: q.id,
        answer: answers[q.id] || null // Send null if not answered
      }));

      const headers = { 'Content-Type': 'application/json' };
      if (isPreview) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const response = await fetch(`${window.API_BASE_URL}/api/psychotest/submit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          psychotest_id: testData.psychotest_id,
          answers: formattedAnswers
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setFinished(true);
      } else {
        alert(data.message || "Gagal mengirim jawaban");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim jawaban");
    } finally {
      setIsSubmitting(false);
      setExamStarted(false);
    }
  };

  const handleNavigateToDashboard = () => {
    exitFullscreen();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role?.toUpperCase() === 'ADMIN') {
        navigate('/dashboard/admin/psychotest');
      } else {
        navigate('/dashboard/user/psychotest');
      }
    } catch (e) {
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Fullscreen Required Overlay
  const FullscreenRequiredOverlay = () => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl text-center border-4 border-amber-500">
        <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <LayoutGrid className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">MODE FULLSCREEN WAJIB</h2>
        <p className="text-gray-600 font-bold mb-8 leading-relaxed">
          Ujian ini menggunakan sistem Keamanan Ketat (Strict Mode).
          Aplikasi harus berada dalam mode layar penuh (fullscreen) selama ujian berlangsung.
        </p>
        <button
          onClick={handleStartExam}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 text-lg"
        >
          KEMBALI KE FULLSCREEN
        </button>
      </div>
    </div>
  );

  // Warning Modal Component
  const WarningModal = () => (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-amber-100 text-center scale-in-center">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">PERINGATAN!</h2>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Anda terdeteksi melanggar aturan ujian (Keluar fullscreen / Tab Switch / DevTools).
          <br /><br />
          Pelanggaran: <span className="text-amber-600 font-black">{cheatCount} / 3</span>.
          Jika mencapai 3/3, Anda akan <span className="text-red-600 font-black uppercase">didiskualifikasi otomatis</span>.
        </p>
        <button
          onClick={() => setShowWarning(false)}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-amber-100 active:scale-95"
        >
          SAYA MENGERTI
        </button>
      </div>
    </div>
  );

  // Disqualified Overlay
  const DisqualifiedOverlay = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-red-600/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Ban className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">DISKUALIFIKASI</h2>
        <p className="text-gray-600 font-bold mb-10 leading-relaxed text-lg">
          Maaf, Anda telah melebihi batas toleransi pelanggaran ({cheatCount}/3 terdeteksi).
          Sesuai aturan CBT Strict Mode, Anda telah didiskualifikasi dari proses ini.
        </p>
        <button
          onClick={() => {
            exitFullscreen();
            navigate('/');
          }}
          className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-2xl active:scale-95 text-xl"
        >
          KEMBALI KE BERANDA
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Memuat Ujian...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Akses Ditolak</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleNavigateToDashboard}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ujian Selesai</h2>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Terima kasih telah mengerjakan psikotes. Jawaban Anda telah berhasil disimpan.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-800 font-medium">Nilai Akhir:</p>
            <p className="text-4xl font-black text-blue-900">{result?.result || result?.score}</p>
          </div>
          <button
            onClick={handleNavigateToDashboard}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Selesai
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData?.questions[currentQuestionIndex];
  const totalQuestions = testData?.questions.length || 0;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col antialiased">
      {/* Anti-cheat UI */}
      {isFullscreenRequired && examStarted && !finished && !isDisqualified && <FullscreenRequiredOverlay />}
      {showWarning && <WarningModal />}
      {isDisqualified && <DisqualifiedOverlay />}

      {/* Header: Clean & Standard */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-900">Psikotes Online</h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
              Mode Pengerjaan
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Clock className={clsx("w-4 h-4", timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-500')} />
            <span className={clsx("text-sm font-bold tabular-nums", timeLeft < 60 ? 'text-red-600' : 'text-gray-700')}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-xl mx-auto w-full px-5 py-8 pb-32">
        {!examStarted ? (
          <div className="flex-1 flex flex-col justify-center text-center py-10">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Instruksi Psikotes</h2>
            <div className="text-left space-y-4 mb-10 text-gray-600 text-sm leading-relaxed px-4">
              <p>1. Wajib menggunakan mode <strong>layar penuh (fullscreen)</strong>.</p>
              <p>2. Dilarang berpindah tab, membuka aplikasi lain, atau DevTools.</p>
              <p>3. Pelanggaran lebih dari 2x akan berakibat <strong>diskualifikasi otomatis</strong>.</p>
              <p>4. Total durasi pengerjaan adalah <strong>{testData.duration} menit</strong>.</p>
              <p>5. <strong>Seluruh pertanyaan wajib dijawab</strong> sebelum mengakhiri ujian.</p>
            </div>
            <button
              onClick={handleStartExam}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all text-lg"
            >
              Mulai Ujian
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Bar & Counter */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Pertanyaan {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span className={clsx(
                  "text-[10px] font-bold px-2 py-1 rounded-lg border",
                  answers[currentQuestion?.id] ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {answers[currentQuestion?.id] ? 'Terjawab' : 'Belum Terjawab'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-10">
              {currentQuestion?.question}
            </h2>

            {/* Options */}
            {currentQuestion?.type === 'multiple_choice' ? (
              <div className="space-y-3">
                {currentQuestion?.options.map((option, i) => (
                  <label
                    key={i}
                    className={clsx(
                      "flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all active:scale-[0.98]",
                      answers[currentQuestion.id] === option
                        ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleOptionChange(currentQuestion.id, option)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-4",
                      answers[currentQuestion.id] === option
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={clsx(
                      "font-medium",
                      answers[currentQuestion.id] === option ? "text-indigo-900" : "text-gray-700"
                    )}>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                placeholder="Ketik jawaban Anda di sini..."
                value={answers[currentQuestion?.id] || ''}
                onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
                className="w-full h-64 p-5 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all resize-none font-medium bg-gray-50"
              ></textarea>
            )}

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 z-40">
              <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="p-4 border-2 border-gray-100 rounded-2xl disabled:opacity-30"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-400" />
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all text-center"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {isSubmitting ? 'Mengirim...' : 'Selesai'}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-10 opacity-30">
              {testData.questions.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    currentQuestionIndex === i ? "w-4 bg-indigo-600" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitConfirm}
        title={Object.keys(answers).length < totalQuestions ? "Jawaban Belum Lengkap" : "Selesai Ujian?"}
        message={Object.keys(answers).length < totalQuestions
          ? `Anda baru menjawab ${Object.keys(answers).length} dari ${totalQuestions} soal. Seluruh pertanyaan wajib diisi sebelum dikirim.`
          : "Pastikan semua jawaban telah terisi dengan benar. Anda tidak dapat kembali setelah mengirim."}
        confirmText={Object.keys(answers).length < totalQuestions ? "Mengerti" : "Ya, Selesai"}
        cancelText={Object.keys(answers).length < totalQuestions ? "" : "Batal"}
        type={Object.keys(answers).length < totalQuestions ? "warning" : "info"}
        onConfirm={() => {
          if (Object.keys(answers).length < totalQuestions) {
            setShowSubmitConfirm(false);
          } else {
            setShowSubmitConfirm(false);
            handleSubmitExam();
          }
        }}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
};

export default UserPsychotestExam;
