import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserPsychotestExam = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isValidCode, setIsValidCode] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null); // 'Lulus', 'Gagal', or null

  // Mock questions
  const questions = [
    {
      id: 1,
      question: "Manakah dari berikut ini yang merupakan ibu kota Indonesia?",
      options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
      correctAnswer: "Jakarta", // For mock validation
    },
    {
      id: 2,
      question: "Berapakah hasil dari 5 + 7?",
      options: ["10", "12", "13", "15"],
      correctAnswer: "12",
    },
    {
      id: 3,
      question: "Siapakah penemu bola lampu?",
      options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Isaac Newton"],
      correctAnswer: "Thomas Edison",
    },
    {
      id: 4,
      question: "Planet terdekat dengan Matahari adalah?",
      options: ["Mars", "Bumi", "Venus", "Merkurius"],
      correctAnswer: "Merkurius",
    },
    {
      id: 5,
      question: "Apa warna langit di siang hari?",
      options: ["Merah", "Hijau", "Biru", "Kuning"],
      correctAnswer: "Biru",
    },
    {
      id: 6,
      question: "Hewan apa yang dikenal sebagai 'raja hutan'?",
      options: ["Harimau", "Singa", "Gajah", "Beruang"],
      correctAnswer: "Singa",
    },
    {
      id: 7,
      question: "Berapa jumlah hari dalam seminggu?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
    },
    {
      id: 8,
      question: "Alat musik apa yang dimainkan dengan memetik senar?",
      options: ["Drum", "Piano", "Gitar", "Terompet"],
      correctAnswer: "Gitar",
    },
  ];

  useEffect(() => {
    // Mock validation for the psychotest code
    // In a real scenario, this would involve an API call to validate the code
    if (code && code.length === 6) { // Example: code must be 6 characters long
      setIsValidCode(true);
    } else {
      setIsValidCode(false);
    }
  }, [code]);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitExam = () => {
    // Mock submission logic
    // In a real scenario, answers would be sent to a backend
    console.log("Submitted Answers:", answers);

    // Simulate result (random Lulus/Gagal)
    const isPassed = Math.random() > 0.5;
    setExamResult(isPassed ? 'Lulus' : 'Gagal');
    setExamStarted(false); // End exam
  };

  if (!isValidCode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Akses Tidak Valid</h2>
          <p className="text-gray-700">Kode psikotes yang Anda masukkan tidak valid atau telah kedaluwarsa.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (examResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className={`text-3xl font-bold mb-4 ${examResult === 'Lulus' ? 'text-green-600' : 'text-red-600'}`}>
            Hasil Psikotes: {examResult}
          </h2>
          <p className="text-gray-700">Terima kasih telah mengerjakan psikotes.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Ujian Psikotes</h1>

        {!examStarted ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              Selamat datang di ujian psikotes. Pastikan Anda memiliki koneksi internet yang stabil dan waktu yang cukup untuk menyelesaikan ujian.
            </p>
            <button
              onClick={handleStartExam}
              className="px-6 py-3 bg-green-600 text-white rounded-md text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Mulai Ujian
            </button>
          </div>
        ) : (
          <div>
            {questions.map((q, index) => (
              <div key={q.id} className="mb-6 p-4 border border-gray-200 rounded-md">
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  {index + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label key={option} className="flex items-center text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleOptionChange(q.id, option)}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 text-center">
              <button
                onClick={handleSubmitExam}
                className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Selesai Ujian
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPsychotestExam;
