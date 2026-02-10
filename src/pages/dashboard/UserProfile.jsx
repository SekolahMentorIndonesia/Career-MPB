import React, { useState } from 'react';
import { Save, Camera, UserCircle } from 'lucide-react';
import PersonalDetailsCard from './PersonalDetailsCard';
import KtpAddressCard from './KtpAddressCard';
import DomicileAddressCard from '././DomicileAddressCard';
import EducationDataForm from './EducationDataForm';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Form States - Initialize name from context if available
  const [name, setName] = useState(user?.name || '');
  const [domicile, setDomicile] = useState('');
  const [ktpAddress, setKtpAddress] = useState('');
  const [ktpRt, setKtpRt] = useState('');
  const [ktpRw, setKtpRw] = useState('');
  const [ktpKelurahan, setKtpKelurahan] = useState('');
  const [ktpKecamatan, setKtpKecamatan] = useState('');
  const [ktpKabupaten, setKtpKabupaten] = useState('');
  const [nik, setNik] = useState('');
  const [lastEducation, setLastEducation] = useState('');
  const [gpa, setGpa] = useState('');
  const [major, setMajor] = useState('');
  const [religion, setReligion] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skills, setSkills] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [domicileRt, setDomicileRt] = useState('');
  const [domicileRw, setDomicileRw] = useState('');
  const [domicileKelurahan, setDomicileKelurahan] = useState('');
  const [domicileKecamatan, setDomicileKecamatan] = useState('');
  const [domicileKabupaten, setDomicileKabupaten] = useState('');

  const [missingMandatoryFields, setMissingMandatoryFields] = useState([]);

  const API_URL = `http://${window.location.hostname}:8000/api`;

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.status === 'success') {
          const d = result.data;
          setName(d.name || '');
          if (d.photo) setProfilePicturePreview(`http://${window.location.hostname}:8000${d.photo}`);
          setNik(d.nik || '');
          setReligion(d.religion || '');
          setHeight(d.height || '');
          setWeight(d.weight || '');
          setBirthPlace(d.birth_place || '');
          setBirthDate(d.birth_date || '');
          setKtpAddress(d.ktp_address || '');
          setKtpRt(d.ktp_rt || '');
          setKtpRw(d.ktp_rw || '');
          setKtpKelurahan(d.ktp_kelurahan || '');
          setKtpKecamatan(d.ktp_kecamatan || '');
          setKtpKabupaten(d.ktp_kabupaten || d.ktp_city || '');
          setDomicile(d.domicile_address || '');
          setDomicileRt(d.domicile_rt || '');
          setDomicileRw(d.domicile_rw || '');
          setDomicileKelurahan(d.domicile_kelurahan || '');
          setDomicileKecamatan(d.domicile_kecamatan || '');
          setDomicileKabupaten(d.domicile_kabupaten || d.domicile_city || '');
          setLastEducation(d.last_education || '');
          setMajor(d.major || '');
          setGpa(d.gpa || '');
          setSkills(d.skills || '');

          // Calculate missing mandatory fields
          const mandatory = [
            ['name', d.name], ['phone', d.phone], ['nik', d.nik],
            ['birth_place', d.birth_place], ['birth_date', d.birth_date],
            ['ktp_address', d.ktp_address], ['ktp_kabupaten', d.ktp_kabupaten || d.ktp_city],
            ['last_education', d.last_education], ['major', d.major]
          ];
          setMissingMandatoryFields(mandatory.filter(([_, v]) => !v).map(([k]) => k));

          if (d.photo) setProfilePicturePreview(`http://${window.location.hostname}:8000${d.photo}`);
        } else if (response.status === 401) {
          logout();
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, logout]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update Profile Data
      const profileResponse = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name, nik, religion, height, weight, birth_place: birthPlace, birth_date: birthDate,
          ktp_address: ktpAddress, ktp_rt: ktpRt, ktp_rw: ktpRw, ktp_kelurahan: ktpKelurahan, ktp_kecamatan: ktpKecamatan, ktp_kabupaten: ktpKabupaten,
          domicile_address: domicile, domicile_rt: domicileRt, domicile_rw: domicileRw, domicile_kelurahan: domicileKelurahan, domicile_kecamatan: domicileKecamatan, domicile_kabupaten: domicileKabupaten,
          last_education: lastEducation, major, gpa, skills
        })
      });

      const profileResult = await profileResponse.json();
      if (profileResult.status !== 'success') {
        throw new Error(profileResult.message || 'Gagal memperbarui data diri');
      }

      // 2. Upload Photo if changed
      if (profilePicture) {
        const formData = new FormData();
        formData.append('photo', profilePicture);
        const photoResponse = await fetch(`${API_URL}/user/upload-photo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const photoResult = await photoResponse.json();
        if (photoResult.status !== 'success') {
          throw new Error(photoResult.message || 'Gagal mengunggah foto');
        }
      }

      // 3. Update Global Context by re-fetching the updated profile
      const finalResponse = await fetch(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const finalResult = await finalResponse.json();
      if (finalResult.status === 'success') {
        updateUser(finalResult.data);
      }

      setIsEditing(false);
      showToast('Profil berhasil diperbarui!', 'success');
    } catch (error) {
      console.error('Update failed:', error);
      showToast(error.message || 'Gagal memperbarui profil.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setName(originalData.name);
      setNik(originalData.nik);
      setReligion(originalData.religion);
      setHeight(originalData.height);
      setWeight(originalData.weight);
      setBirthPlace(originalData.birth_place);
      setBirthDate(originalData.birth_date);
      setKtpAddress(originalData.ktp_address);
      setKtpRt(originalData.ktp_rt);
      setKtpRw(originalData.ktp_rw);
      setKtpKelurahan(originalData.ktp_kelurahan);
      setKtpKecamatan(originalData.ktp_kecamatan);
      setKtpKabupaten(originalData.ktp_kabupaten);
      setDomicile(originalData.domicile_address);
      setDomicileRt(originalData.domicile_rt);
      setDomicileRw(originalData.domicile_rw);
      setDomicileKelurahan(originalData.domicile_kelurahan);
      setDomicileKecamatan(originalData.domicile_kecamatan);
      setDomicileKabupaten(originalData.domicile_kabupaten);
      setLastEducation(originalData.last_education);
      setMajor(originalData.major);
      setGpa(originalData.gpa);
      setSkills(originalData.skills);
      setProfilePicturePreview(originalData.photo ? `http://${window.location.hostname}:8000${originalData.photo}` : null);
    }
    setIsEditing(false);
    setProfilePicture(null);
  };

  const startEditing = () => {
    setOriginalData({
      name, nik, religion, height, weight, birth_place: birthPlace, birth_date: birthDate,
      ktp_address: ktpAddress, ktp_rt: ktpRt, ktp_rw: ktpRw, ktp_kelurahan: ktpKelurahan, ktp_kecamatan: ktpKecamatan, ktp_kabupaten: ktpKabupaten,
      domicile_address: domicile, domicile_rt: domicileRt, domicile_rw: domicileRw, domicile_kelurahan: domicileKelurahan, domicile_kecamatan: domicileKecamatan, domicile_kabupaten: domicileKabupaten,
      last_education: lastEducation, major, gpa, skills
    });
    setIsEditing(true);
  };

  if (loading) return <div className="p-6 text-center">Memuat profil...</div>;

  return (
    <div className="p-6 relative">
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-24 right-8 z-[100] transform transition-all duration-300 ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 font-primary text-gray-800">Profil Saya</h1>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-bold rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all font-primary tracking-wide uppercase"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          ) : (
            <button
              onClick={startEditing}
              className="inline-flex items-center px-5 py-2.5 border border-blue-600 rounded-lg shadow-sm text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all border-2"
            >
              <Camera className="h-4 w-4 mr-2" />
              Ubah Data Diri
            </button>
          )}
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit}>
        <PersonalDetailsCard
          isEditing={isEditing}
          name={name} setName={setName}
          nik={nik} setNik={setNik}
          religion={religion} setReligion={setReligion}
          height={height} setHeight={setHeight}
          weight={weight} setWeight={setWeight}
          birthPlace={birthPlace} setBirthPlace={setBirthPlace}
          birthDate={birthDate} setBirthDate={setBirthDate}
          missingFields={missingMandatoryFields}
        />

        <EducationDataForm
          isEditing={isEditing}
          lastEducation={lastEducation} setLastEducation={setLastEducation}
          gpa={gpa} setGpa={setGpa}
          major={major} setMajor={setMajor}
          skills={skills} setSkills={setSkills}
          missingFields={missingMandatoryFields}
        />

        <KtpAddressCard
          isEditing={isEditing}
          ktpAddress={ktpAddress} setKtpAddress={setKtpAddress}
          ktpRt={ktpRt} setKtpRt={setKtpRt}
          ktpRw={ktpRw} setKtpRw={setKtpRw}
          ktpKelurahan={ktpKelurahan} setKtpKelurahan={setKtpKelurahan}
          ktpKecamatan={ktpKecamatan} setKtpKecamatan={setKtpKecamatan}
          ktpKabupaten={ktpKabupaten} setKtpKabupaten={setKtpKabupaten}
          missingFields={missingMandatoryFields}
        />

        <DomicileAddressCard
          isEditing={isEditing}
          domicile={domicile} setDomicile={setDomicile}
          domicileRt={domicileRt} setDomicileRt={setDomicileRt}
          domicileRw={domicileRw} setDomicileRw={setDomicileRw}
          domicileKelurahan={domicileKelurahan} setDomicileKelurahan={setDomicileKelurahan}
          domicileKecamatan={domicileKecamatan} setDomicileKecamatan={setDomicileKecamatan}
          domicileKabupaten={domicileKabupaten} setDomicileKabupaten={setDomicileKabupaten}
        />


        {isEditing && (
          <p className="text-sm font-bold text-rose-500 mt-4">*Semua data wajib diisi sebelum melamar pekerjaan</p>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
