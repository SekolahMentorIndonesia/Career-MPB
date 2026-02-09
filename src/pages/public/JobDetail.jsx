import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, ArrowLeft, CheckCircle2 } from 'lucide-react';

const JobDetail = () => {
  const { slug } = useParams();

  // In a real app, fetch job by slug
  // Mock data
  const job = {
    title: 'Senior Frontend Developer',
    description: 'Kami mencari Senior Frontend Developer yang berpengalaman dalam membangun aplikasi web modern menggunakan React, Tailwind, dan TypeScript.',
    requirements: [
      'Minimal 4 tahun pengalaman dengan React',
      'Memahami state management (Redux/Zustand)',
      'Berpengalaman dengan Tailwind CSS',
      'Memahami konsep Clean Code'
    ],
    location: 'Jakarta (Hybrid)',
    type: 'Full-time',
    salary: 'IDR 15M - 25M'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Lowongan
      </Link>

      <div className="bg-white rounded-2xl border shadow-sm p-8">
        <div className="border-b pb-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-6 text-gray-600">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {job.type}</span>
            <span className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> {job.salary}</span>
          </div>
        </div>

        <div className="prose max-w-none text-gray-600 mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Pekerjaan</h3>
          <p className="mb-6">{job.description}</p>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">Kualifikasi</h3>
          <ul className="space-y-3">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Link 
            to={`/apply/${slug}`}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Lamar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
