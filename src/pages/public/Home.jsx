import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Briefcase, Users, TrendingUp } from 'lucide-react';
import JobSearchSection from '../../components/JobSearchSection';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="space-y-20 pb-20">

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase mb-8">
                Karir
              </div>

              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:leading-tight mb-6">
                Bergabung <br />
                Bersama Kami
              </h1>

              <p className="mt-4 text-lg text-gray-600 leading-relaxed font-medium">
                Jadilah bagian dari tim yang inovatif dan dinamis. Kami mencari talenta terbaik untuk tumbuh dan menciptakan dampak nyata bersama.
              </p>

              <p className="mt-4 text-base text-gray-500 leading-relaxed mb-8">
                Bangun karier profesionalmu di lingkungan yang kolaboratif, teknologis, dan penuh peluang berkembang.
              </p>

              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                {user?.role !== 'admin' && (
                  <Link
                    to="/#karir-section"
                    className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    Lihat Posisi Tersedia <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Image/Illustration */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://img.freepik.com/free-vector/recruitment-concept-illustration_114360-708.jpg?w=1060&t=st=1707458267~exp=1707458867~hmac=64a27529458934578505504245657805890666"
                    alt="Team Recruitment Illustration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20 pointer-events-none">
          <div className="w-96 h-96 bg-blue-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20 pointer-events-none">
          <div className="w-96 h-96 bg-indigo-400 rounded-full"></div>
        </div>
      </section>

      {/* Benefits / Culture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Kenapa Bergabung?</h2>
          <p className="mt-4 text-lg text-gray-600">Kami menawarkan lebih dari sekadar pekerjaan.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Jenjang Karir Jelas",
              desc: "Lintasan karir terstruktur untuk pertumbuhan profesional Anda."
            },
            {
              icon: Users,
              title: "Lingkungan Kolaboratif",
              desc: "Bekerja dengan tim terbaik yang saling mendukung."
            },
            {
              icon: Briefcase,
              title: "Proyek Menantang",
              desc: "Terlibat dalam proyek skala besar yang berdampak nyata."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 md:p-12 text-white flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
          {/* Background Glow Effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 text-blue-100 border border-white/10">
              <span className="mr-1">🎓</span>
              Students & Graduates
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              Program Magang & PKL
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Kami tidak hanya mencari profesional berpengalaman. Kami juga membuka pintu bagi siswa SMK dan mahasiswa yang ingin belajar, berkembang, dan mendapatkan pengalaman dunia kerja yang sesungguhnya.
            </p>

            {user?.role !== 'admin' && (
              <Link
                to="/#karir-section"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Kirim Lamaran <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>

          <div className="w-full lg:w-[400px] relative z-10">
            <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="text-lg font-bold mb-6 pb-4 border-b border-gray-700/50 text-white">PKL & Magang Benefits</h3>
              <div className="space-y-6">
                {[
                  { id: 1, title: "Real Projects", desc: "Pengalaman kerja nyata di proyek sungguhan." },
                  { id: 2, title: "Expert Mentorship", desc: "Mentoring langsung dari praktisi industri." },
                  { id: 3, title: "Career Path", desc: "Sertifikat dan peluang karir permanen." },
                ].map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center border border-blue-500/20">
                      {item.id}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      <JobSearchSection />
    </div>
  );
};

export default Home;
