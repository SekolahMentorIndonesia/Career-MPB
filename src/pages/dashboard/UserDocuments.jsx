import React, { useState, useEffect } from 'react';
import { Upload, Link, Save, FileText, Image, Award, Briefcase, AlertCircle, Loader2, Eye, PencilLine, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import clsx from 'clsx';

const FileInput = ({ label, id, onChange, required = false, icon: Icon, description, uploadedFile, isEditing }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (uploadedFile?.file) {
      const url = URL.createObjectURL(uploadedFile.file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (uploadedFile?.isExisting && uploadedFile?.url) {
      const fullUrl = uploadedFile.url.startsWith('http')
        ? uploadedFile.url
        : `${window.API_BASE_URL}${uploadedFile.url}`;

      if (typeof uploadedFile.url === 'string' && uploadedFile.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
        setPreview(fullUrl);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [uploadedFile]);

  const backendUrl = `${window.API_BASE_URL}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <h3 className="text-sm font-bold text-gray-900">{label}</h3>
        </div>

        {preview ? (
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100 border border-gray-100 group">
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a href={preview} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-gray-900 shadow-lg">
                <Eye className="w-5 h-5" />
              </a>
            </div>
          </div>
        ) : uploadedFile?.isExisting ? (
          <div className="aspect-[4/3] rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center mb-4 gap-2">
            <FileText className="w-10 h-10 text-blue-400" />
            <span className="text-xs font-bold text-blue-600">DOKUMEN TERSEDIA (PDF)</span>
            <a href={`${backendUrl}${uploadedFile.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 underline">Lihat Dokumen</a>
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center mb-4 gap-2 text-gray-400">
            <Upload className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-medium tracking-wider">BELUM ADA DOKUMEN</span>
          </div>
        )}

        {isEditing ? (
          <div className="mt-2 group">
            <label
              htmlFor={id}
              className="w-full h-12 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              {uploadedFile?.file ? 'Ganti Berkas' : 'Pilih Berkas'}
              <input
                id={id}
                name={id}
                type="file"
                className="sr-only"
                onChange={onChange}
                onClick={(e) => { e.target.value = null; }} // Allow re-selecting same file
                accept={
                  id === 'cv' ? '.pdf' :
                    (id === 'sertifikat' || id === 'paklaring' || id === 'portofolioFile') ? '.pdf,image/*' :
                      'image/*'
                }
              />
            </label>
            {uploadedFile?.file && (
              <p className="mt-2 text-[10px] text-blue-600 font-bold italic truncate px-1">
                Akan diunggah: {uploadedFile.file.name}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-2">
            {uploadedFile?.isExisting ? (
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Terverifikasi</span>
              </div>
            ) : required ? (
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 rounded-lg border border-rose-100">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-tight">Wajib Diisi</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

const UserDocuments = () => {
  const [files, setFiles] = useState({
    cv: null,
    pasFoto: null,
    portofolioFile: null,
    ktp: null,
    sertifikat: null,
    paklaring: null
  });
  const [portofolioLink, setPortofolioLink] = useState('');
  const [existingDocs, setExistingDocs] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchExistingDocuments();
  }, []);

  const fetchExistingDocuments = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/user/documents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setExistingDocs(data.data || {});
        if (data.data?.portfolio_link) {
          setPortofolioLink(data.data.portfolio_link);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileChange = (key) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification('error', 'Ukuran File Terlalu Besar', `Maksimal ukuran file adalah 5MB. File "${file.name}" berukuran ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      e.target.value = ''; // Reset input
      return;
    }

    if (key === 'cv' && file.type !== 'application/pdf') {
      showNotification('error', 'Format Tidak Sesuai', 'Curriculum Vitae (CV) harus dalam format PDF.');
      e.target.value = '';
      return;
    }

    if ((key === 'pasFoto' || key === 'ktp') && !file.type.startsWith('image/')) {
      showNotification('error', 'Format Tidak Sesuai', 'Foto harus dalam format gambar (JPG, PNG, atau WEBP).');
      e.target.value = '';
      return;
    }

    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (files.cv) formData.append('cv', files.cv);
    if (files.pasFoto) formData.append('pasFoto', files.pasFoto);
    if (files.portofolioFile) formData.append('portofolioFile', files.portofolioFile);
    if (portofolioLink) formData.append('portfolioLink', portofolioLink);
    if (files.ktp) formData.append('ktp', files.ktp);
    if (files.sertifikat) formData.append('sertifikat', files.sertifikat);
    if (files.paklaring) formData.append('paklaring', files.paklaring);

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/user/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Berhasil!', 'Dokumen telah disimpan.');
        setIsEditing(false);
        setFiles({ cv: null, pasFoto: null, portofolioFile: null, ktp: null, sertifikat: null, paklaring: null });
        fetchExistingDocuments();
      } else {
        showNotification('error', 'Gagal!', data.message || 'Gagal menyimpan dokumen');
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFiles({ cv: null, pasFoto: null, portofolioFile: null, ktp: null, sertifikat: null, paklaring: null });
    // Re-fetch to reset portofolio link if cancelled
    fetchExistingDocuments();
  };

  const areMandatoryUploaded = (files.cv || existingDocs.cv_url) &&
    (files.pasFoto || existingDocs.photo_url) &&
    (files.ktp || existingDocs.ktp_url);

  if (isFetching) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Menyelaraskan dokumen...</p>
      </div>
    );
  }

  const backendUrl = `${window.API_BASE_URL}`;

  return (
    <div className="pb-12 bg-transparent">
      {/* HEADER SECTION */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-transparent border-b border-gray-200/50 mb-8 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Berkas Karir</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Kelola dokumen persyaratan lamaran Anda di sini.</p>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 bg-blue-600 text-white rounded-xl text-sm font-extrabold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-extrabold hover:bg-blue-50 transition-all"
              >
                <PencilLine className="w-4 h-4" /> Edit Dokumen
              </button>
            )}
          </div>
        </div>
      </div>

      {!areMandatoryUploaded && !isEditing && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-600 flex-shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-rose-900">Dokumen Belum Lengkap</p>
            <p className="text-sm text-rose-700 leading-relaxed">
              Silakan klik tombol <b>Ubah Dokumen</b> di atas dan unggah CV, Pas Foto, serta KTP agar Anda dapat mulai melamar posisi yang tersedia.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: DOKUMEN WAJIB */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
          <div className="p-2 bg-rose-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Dokumen Wajib</h2>
            <p className="text-xs text-gray-500 font-medium">Harus dilengkapi sebelum melamar pekerjaan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FileInput
            label="Curriculum Vitae (CV)"
            id="cv"
            icon={FileText}
            isEditing={isEditing}
            required={true}
            onChange={handleFileChange('cv')}
            uploadedFile={files.cv ? { file: files.cv } : { isExisting: !!existingDocs?.cv_url, url: existingDocs?.cv_url }}
            description="Format PDF, Max 2MB"
          />

          <FileInput
            label="Pas Foto Terbaru"
            id="pasFoto"
            icon={Image}
            isEditing={isEditing}
            required={true}
            onChange={handleFileChange('pasFoto')}
            uploadedFile={files.pasFoto ? { file: files.pasFoto } : { isExisting: !!existingDocs?.photo_url, url: existingDocs?.photo_url }}
            description="Format JPG/PNG, Wajah terlihat jelas"
          />

          <FileInput
            label="Foto KTP"
            id="ktp"
            icon={Image}
            isEditing={isEditing}
            required={true}
            onChange={handleFileChange('ktp')}
            uploadedFile={files.ktp ? { file: files.ktp } : { isExisting: !!existingDocs?.ktp_url, url: existingDocs?.ktp_url }}
            description="Format JPG/PNG, NIK terbaca"
          />
        </div>
      </div>

      {/* SECTION: DOKUMEN OPSIONAL */}
      <div>
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Dokumen Opsional</h2>
            <p className="text-xs text-gray-500 font-medium">Dapat ditambahkan untuk memperkuat profil Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Portofolio</h3>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-4 text-center group hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer relative">
                      <label htmlFor="portofolioFile" className="cursor-pointer block">
                        <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-60 group-hover:opacity-100" />
                        <p className="text-[10px] font-bold text-blue-700 uppercase">Upload Berkas (PDF/LinkGambar)</p>
                        <input id="portofolioFile" type="file" className="sr-only" onChange={handleFileChange('portofolioFile')} onClick={(e) => { e.target.value = null; }} accept=".pdf,image/*" />
                      </label>
                      {files.portofolioFile && <p className="mt-2 text-[10px] text-blue-600 font-bold truncate px-1">Siap: {files.portofolioFile.name}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block px-1">Atau Tautan Eksternal</label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://behance.net/username"
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={portofolioLink}
                          onChange={(e) => setPortofolioLink(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 text-center min-h-[120px] flex flex-col items-center justify-center gap-3">
                    {existingDocs.portfolio_url || existingDocs.portfolio_link ? (
                      <div className="flex flex-col gap-3 w-full">
                        {existingDocs.portfolio_url && (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-[10px] font-bold text-gray-700 truncate">Berkas Terunggah</span>
                            </div>
                            <a href={`${backendUrl}${existingDocs.portfolio_url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-extrabold hover:underline whitespace-nowrap">LIHAT PDF</a>
                          </div>
                        )}

                        {existingDocs.portfolio_link && (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Link className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                              <span className="text-[10px] font-bold text-gray-700 truncate">{existingDocs.portfolio_link.replace(/^https?:\/\//, '')}</span>
                            </div>
                            <a href={existingDocs.portfolio_link.startsWith('http') ? existingDocs.portfolio_link : `https://${existingDocs.portfolio_link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-extrabold hover:underline whitespace-nowrap">BUKA LINK</a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <Briefcase className="w-8 h-8 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Belum Ada Data</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <FileInput
            label="Sertifikat Pendukung"
            id="sertifikat"
            icon={Award}
            isEditing={isEditing}
            required={false}
            onChange={handleFileChange('sertifikat')}
            uploadedFile={files.sertifikat ? { file: files.sertifikat } : { isExisting: !!existingDocs?.other_url, url: existingDocs?.other_url }}
            description="Sertifikat keahlian / pelatihan"
          />

          <FileInput
            label="Surat Keterangan Kerja (Paklaring)"
            id="paklaring"
            icon={Briefcase}
            isEditing={isEditing}
            required={false}
            onChange={handleFileChange('paklaring')}
            uploadedFile={files.paklaring ? { file: files.paklaring } : { isExisting: !!existingDocs?.paklaring_url, url: existingDocs?.paklaring_url }}
            description="Jika memiliki pengalaman kerja"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;
