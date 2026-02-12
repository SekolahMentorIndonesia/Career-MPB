import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, User as UserIcon, Phone, Mail, Lock as LockIcon, Trash2 } from 'lucide-react';
import Notification from '../../components/Notification';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../hooks/useAuth';

const AdminProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    photo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const backendUrl = `${window.API_BASE_URL}`;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setProfile({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          photo: result.data.photo || ''
        });
        // Sync context on load just in case
        updateUser(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('error', 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('error', 'Ukuran File Terlalu Besar', 'Maksimal ukuran foto adalah 2MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Upload Photo if changed
      let currentPhoto = profile.photo;
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const photoRes = await fetch(`${backendUrl}/api/user/upload-photo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        const photoResult = await photoRes.json();
        if (photoResult.success) {
          currentPhoto = photoResult.data.photo_url;
        } else {
          throw new Error(photoResult.message || 'Gagal mengunggah foto');
        }
      }

      // 2. Update Profile Fields
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          photo: currentPhoto
        })
      });

      const result = await response.json();
      if (result.success) {
        showNotification('success', 'Berhasil', 'Profil Anda telah diperbarui.');

        const newProfileData = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          photo: currentPhoto
        };

        setProfile(prev => ({ ...prev, photo: currentPhoto }));
        setPhotoFile(null);
        setPhotoPreview(null);

        // Update Global Context
        updateUser(newProfileData);

      } else {
        throw new Error(result.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      showNotification('error', 'Gagal', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeletePhoto = async () => {
    setShowDeleteConfirm(false);

    setSaving(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/upload-photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (result.success) {
        showNotification('success', 'Berhasil', 'Foto profil telah dihapus.');
        const newProfileData = { ...profile, photo: null };
        setProfile(prev => ({ ...prev, photo: null }));
        setPhotoFile(null);
        setPhotoPreview(null);
        updateUser(newProfileData);
      } else {
        throw new Error(result.message || 'Gagal menghapus foto');
      }
    } catch (error) {
      showNotification('error', 'Gagal', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Hapus Foto Profil"
        message="Apakah Anda yakin ingin menghapus foto profil Anda? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDeletePhoto}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Profil Admin</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Kelola informasi dasar akun administrator Anda.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* FOTO PROFIL SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-blue-50 bg-gray-50 flex items-center justify-center shadow-inner">
                {photoPreview || profile.photo ? (
                  <img
                    src={photoPreview || (profile.photo ? `${backendUrl}${profile.photo}` : null)}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-300" />
                )}

                <label className="absolute inset-0 bg-blue-600/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Ubah Foto</span>
                  <input type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Pas Foto Admin</h3>
              <p className="text-xs text-gray-500 font-medium max-w-xs mb-2">
                Gunakan foto formal profesional. Format JPG/PNG, maks. 2MB.
              </p>
              {(profile.photo || photoPreview) && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Foto
                </button>
              )}
            </div>
          </div>

          {/* FIELDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-gray-200 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-500 outline-none cursor-not-allowed select-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <LockIcon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-red-400 font-medium ml-1">*Hanya dapat diubah melalui Database</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  readOnly
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-gray-200 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-500 outline-none cursor-not-allowed select-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <LockIcon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-red-400 font-medium ml-1">*Hanya dapat diubah melalui Database</p>
            </div>
          </div>

          {/* ACTION SECTION */}
          <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;