import React, { useState } from 'react';
import { Upload, Link, Save, FileText, Image, Award, Briefcase, AlertCircle } from 'lucide-react';

const FileInput = ({ label, id, onChange, required = false, icon: Icon, description, uploadedFile }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-center mb-4">
      {Icon && <Icon className="h-12 w-12 text-gray-500" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{label}</h3>
    <p className="text-sm text-gray-500 text-center mb-4">{description}</p>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor={id}
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <span>Pilih File</span>
            <input id={id} name={id} type="file" className="sr-only" onChange={onChange} />
          </label>
        </div>
        {uploadedFile ? (
          <p className="text-sm text-gray-500">File terpilih: {uploadedFile.name}</p>
        ) : (
          required && (
            <p className="text-sm text-red-500 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 mr-1" /> Dokumen belum diunggah
            </p>
          )
        )}
      </div>
    </div>
  </div>
);

const UserDocuments = () => {
  const [cvFile, setCvFile] = useState(null);
  const [pasFotoFile, setPasFotoFile] = useState(null);
  const [portofolioFile, setPortofolioFile] = useState(null);
  const [portofolioLink, setPortofolioLink] = useState('');
  const [ktpFile, setKtpFile] = useState(null);
  const [sertifikatFile, setSertifikatFile] = useState(null);
  const [paklaringFile, setPaklaringFile] = useState(null);

  const areMandatoryDocumentsUploaded = cvFile && pasFotoFile && ktpFile;

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (cvFile) formData.append('cv', cvFile);
    if (pasFotoFile) formData.append('pasFoto', pasFotoFile);
    if (portofolioFile) formData.append('portofolioFile', portofolioFile);
    if (portofolioLink) formData.append('portofolioLink', portofolioLink);
    if (ktpFile) formData.append('ktp', ktpFile);
    if (sertifikatFile) formData.append('sertifikat', sertifikatFile);
    if (paklaringFile) formData.append('paklaring', paklaringFile);

    console.log('Document Data Submitted:', Object.fromEntries(formData.entries()));
    // Here you would typically send this data to a backend API
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dokumen Saya</h1>
      <p className="text-gray-600 mb-6">Unggah dokumen yang diperlukan untuk melamar pekerjaan.</p>

      {!areMandatoryDocumentsUploaded && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-3" />
            <div>
              <p className="font-bold">Dokumen Belum Lengkap</p>
              <p className="text-sm">Wajib mengunggah CV dan Foto Terbaru untuk dapat mengirim lamaran.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FileInput
          label="Curriculum Vitae (CV)"
          id="cv-upload"
          onChange={handleFileChange(setCvFile)}
          required
          icon={FileText}
          description="Format: PDF (Max 2MB)"
          uploadedFile={cvFile}
        />

        <FileInput
          label="Pas Foto Terbaru"
          id="pas-foto-upload"
          onChange={handleFileChange(setPasFotoFile)}
          required
          icon={Image}
          description="Format: JPG/PNG (Max 1MB)"
          uploadedFile={pasFotoFile}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">Portofolio</h3>
          <p className="text-sm text-gray-500 text-center mb-4">Format: PDF / Links</p>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="portofolio-file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Pilih File</span>
                  <input id="portofolio-file-upload" name="portofolio-file-upload" type="file" className="sr-only" onChange={handleFileChange(setPortofolioFile)} />
                </label>
              </div>
              {portofolioFile && <p className="text-sm text-gray-500">File terpilih: {portofolioFile.name}</p>}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">ATAU TAUTAN</p>
          <div className="mt-2 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              name="portofolio-link"
              id="portofolio-link"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://portofolio-anda.com"
              value={portofolioLink}
              onChange={(e) => setPortofolioLink(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Opsional</p>
        </div>

        <FileInput
          label="Foto KTP"
          id="ktp-upload"
          onChange={handleFileChange(setKtpFile)}
          required
          icon={Image}
          description="Format: JPG, PNG (Max 1MB)"
          uploadedFile={ktpFile}
        />

        <FileInput
          label="Sertifikat Pendukung (Opsional)"
          id="sertifikat-upload"
          onChange={handleFileChange(setSertifikatFile)}
          icon={Award}
          description="Format: PDF, JPG, PNG (Max 2MB)"
          uploadedFile={sertifikatFile}
        />

        <FileInput
          label="Paklaring (Opsional)"
          id="paklaring-upload"
          onChange={handleFileChange(setPaklaringFile)}
          icon={Briefcase}
          description="Format: PDF, DOCX (Max 2MB)"
          uploadedFile={paklaringFile}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-5 w-5 mr-2" />
          Simpan Dokumen
        </button>
      </div>
    </form>
  );
};

export default UserDocuments;
