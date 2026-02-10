import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, CheckCircle2, ChevronLeft, ChevronRight, Grid, LayoutGrid, ShieldAlert, Ban } from 'lucide-react';
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

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const url = isPreview
          ? `http://${window.location.hostname}:8000/api/psychotest/preview`
          : `http://${window.location.hostname}:8000/api/psychotest/test?app_id=${appId}`;

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
    if (!examStarted || finished || isDisqualified || isPreview) return;

    const handleViolation = () => {
      setCheatCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setIsDisqualified(true);
          handleDisqualify();
          return newCount;
        }
        setShowWarning(true);
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      handleViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, finished, isDisqualified, isPreview]);

  const handleDisqualify = async () => {
    setIsSubmitting(true);
    exitFullscreen();
    try {
      // Send disqualification to backend
      await fetch(`http://${window.location.hostname}:8000/api/psychotest/submit`, {
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
      // Mock result for preview mode
      setTimeout(() => {
        setResult({ grade: 'A (Demo)' });
        setFinished(true);
        setIsSubmitting(false);
        setExamStarted(false);
      }, 1500);
      return;
    }

    try {
      // Format answers for backend
      const formattedAnswers = Object.entries(answers).map(([qid, ans]) => ({
        question_id: parseInt(qid),
        answer: ans
      }));

      const response = await fetch(`http://${window.location.hostname}:8000/api/psychotest/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Warning Modal Component
  const WarningModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-amber-100 text-center scale-in-center">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">PERINGATAN!</h2>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Anda terdeteksi keluar dari jendela ujian. Dilarang membuka tab lain atau meminimalkan browser.
          <br /><br />
          Toleransi: <span className="text-amber-600 font-black">{cheatCount} / 2</span>.
          Jika mencapai 3x, Anda akan <span className="text-red-600 font-black uppercase">didiskualifikasi otomatis</span>.
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
          Maaf, Anda telah melebihi batas toleransi pelanggaran (3x keluar jendela ujian).
          Sesuai aturan CBT, Anda telah didiskualifikasi dari proses ini.
        </p>
        <button
          onClick={() => navigate('/')}
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
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Kembali ke Beranda
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
            <p className="text-sm text-blue-800 font-medium">Kategori Hasil:</p>
            <p className="text-2xl font-black text-blue-900">Grade {result?.grade}</p>
          </div>
          <button
            onClick={() => navigate('/')}
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col relative overflow-x-hidden">
      {/* Anti-cheat UI */}
      {showWarning && <WarningModal />}
      {isDisqualified && <DisqualifiedOverlay />}
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">PSIKOTES ONLINE</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                {isPreview ? 'Mode Pratinjau' : 'MPB Corps Recruitment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <Clock className={clsx("w-5 h-5", timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-500')} />
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Sisa Waktu</p>
                <p className={`text-lg font-black tabular-nums leading-none ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        {!examStarted ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center max-w-2xl w-full">
              <h1 className="text-3xl font-black text-gray-900 mb-6">Instruksi Psikotes</h1>
              <div className="text-left bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                <ul className="space-y-4 text-blue-900 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Dilarang menutup browser atau berpindah tab saat ujian berlangsung.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Setiap jawaban akan disimpan secara otomatis jika waktu habis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Durasi pengerjaan: <span className="font-bold underline">{testData.duration} menit</span>.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleStartExam}
                className="py-4 px-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95 w-full md:w-auto"
              >
                Mulai Ujian Sekarang
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content: Current Question */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
                <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
                    PERTANYAAN {currentQuestionIndex + 1} DARI {totalQuestions}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter",
                    answers[currentQuestion?.id] ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {answers[currentQuestion?.id] ? 'Sudah Terjawab' : 'Belum Terjawab'}
                  </span>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-10">
                      {currentQuestion?.question}
                    </h2>

                    {currentQuestion?.type === 'multiple_choice' ? (
                      <div className="space-y-4">
                        {currentQuestion?.options.map((option, i) => (
                          <label
                            key={i}
                            className={clsx(
                              "group relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all active:scale-[0.98]",
                              answers[currentQuestion.id] === option
                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-50"
                                : "border-gray-100 hover:border-blue-300 hover:bg-gray-50"
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
                              "w-10 h-10 rounded-xl flex items-center justify-center font-black mr-4 transition-all",
                              answers[currentQuestion.id] === option
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                            )}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className="font-bold text-lg">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <textarea
                          placeholder="Ketik jawaban Anda di sini..."
                          value={answers[currentQuestion?.id] || ''}
                          onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
                          className="w-full h-64 p-6 border-2 border-gray-100 rounded-3xl focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all resize-none font-medium text-lg"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center gap-4">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 md:flex-none flex items-center justify-center px-8 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    SEBELUMNYA
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="flex-1 md:flex-none flex items-center justify-center px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-gray-100 active:scale-95"
                    >
                      SELANJUTNYA
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin mengakhiri ujian?")) {
                          handleSubmitExam();
                        }
                      }}
                      disabled={isSubmitting}
                      className="flex-1 md:flex-none flex items-center justify-center px-12 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Grid className="w-5 h-5 mr-2" />}
                      {isSubmitting ? 'MENGIRIM...' : 'SELESAI UJIAN'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar: Question Navigator */}
            <div className="w-full lg:w-[350px] space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  NAVIGASI SOAL
                </h3>

                <div className="grid grid-cols-5 gap-3">
                  {testData.questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={clsx(
                        "w-full aspect-square rounded-xl flex items-center justify-center font-black text-sm transition-all border-2 active:scale-90",
                        currentQuestionIndex === i
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                          : answers[q.id]
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-tighter">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                    <span className="text-gray-500">Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded-sm"></div>
                    <span className="text-gray-500">Terjawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border border-gray-100 rounded-sm"></div>
                    <span className="text-gray-500">Belum</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-blue-600 rounded-3xl shadow-xl shadow-blue-100 p-8 text-white">
                <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-4">Ringkasan Progress</p>
                <div className="flex items-end justify-between mb-2">
                  <h4 className="text-4xl font-black">
                    {Object.keys(answers).length}
                    <span className="text-blue-300 text-xl font-bold ml-1">/ {totalQuestions}</span>
                  </h4>
                  <p className="text-blue-100 font-bold mb-1">
                    {Math.round((Object.keys(answers).length / totalQuestions) * 100)}%
                  </p>
                </div>
                <div className="w-full h-3 bg-blue-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPsychotestExam;
