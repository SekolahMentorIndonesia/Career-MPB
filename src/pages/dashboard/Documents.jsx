import React, { useState } from 'react';
import { Upload, Link, Save, FileText, Image, Award, Briefcase } from 'lucide-react';

const Documents = () => {
  const [cvFile, setCvFile] = useState(null);
  const [pasFotoFile, setPasFotoFile] = useState(null);
  const [portofolioFile, setPortofolioFile] = useState(null);
  const [portofolioLink, setPortofolioLink] = useState('');
  const [ktpFile, setKtpFile] = useState(null);
  const [sertifikatFile, setSertifikatFile] = useState(null);
  const [paklaringFile, setPaklaringFile] = useState(null);

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

  const FileInput = ({ label, id, onChange, required = false, icon: Icon, description }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2 text-gray-500" />}
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Unggah file</span>
              <input id={id} name={id} type="file" className="sr-only" onChange={onChange} />
            </label>
            <p className="pl-1">atau seret dan lepas</p>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dokumen Saya</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FileInput
            label="Curriculum Vitae (CV)"
            id="cv-upload"
            onChange={handleFileChange(setCvFile)}
            required
            icon={FileText}
            description="PDF, DOCX (Max 2MB)"
          />
          {cvFile && <p className="text-sm text-gray-500">File CV terpilih: {cvFile.name}</p>}

          <FileInput
            label="Pas Foto"
            id="pas-foto-upload"
            onChange={handleFileChange(setPasFotoFile)}
            required
            icon={Image}
            description="JPG, PNG (Max 1MB)"
          />
          {pasFotoFile && <p className="text-sm text-gray-500">File Pas Foto terpilih: {pasFotoFile.name}</p>}

          <div>
            <label htmlFor="portofolio-file-upload" className="block text-sm font-medium text-gray-700 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-500" />
              Portofolio (Wajib jika lamaran IT)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="portofolio-file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Unggah file</span>
                    <input id="portofolio-file-upload" name="portofolio-file-upload" type="file" className="sr-only" onChange={handleFileChange(setPortofolioFile)} />
                  </label>
                  <p className="pl-1">atau seret dan lepas</p>
                </div>
                <p className="text-xs text-gray-500">PDF (Max 5MB)</p>
              </div>
            </div>
            {portofolioFile && <p className="text-sm text-gray-500">File Portofolio terpilih: {portofolioFile.name}</p>}
            <p className="mt-2 text-sm text-gray-500 text-center">ATAU</p>
            <label htmlFor="portofolio-link" className="block text-sm font-medium text-gray-700 mt-4">Tautan Portofolio</label>
            <div className="mt-1 relative rounded-md shadow-sm">
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
          </div>

          <FileInput
            label="Foto KTP"
            id="ktp-upload"
            onChange={handleFileChange(setKtpFile)}
            required
            icon={Image}
            description="JPG, PNG (Max 1MB)"
          />
          {ktpFile && <p className="text-sm text-gray-500">File KTP terpilih: {ktpFile.name}</p>}

          <FileInput
            label="Sertifikat Pendukung (Opsional)"
            id="sertifikat-upload"
            onChange={handleFileChange(setSertifikatFile)}
            icon={Award}
            description="PDF, JPG, PNG (Max 2MB)"
          />
          {sertifikatFile && <p className="text-sm text-gray-500">File Sertifikat terpilih: {sertifikatFile.name}</p>}

          <FileInput
            label="Surat Pengalaman Kerja (Paklaring) (Opsional)"
            id="paklaring-upload"
            onChange={handleFileChange(setPaklaringFile)}
            icon={Briefcase}
            description="PDF, DOCX (Max 2MB)"
          />
          {paklaringFile && <p className="text-sm text-gray-500">File Paklaring terpilih: {paklaringFile.name}</p>}

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
      </div>
    </div>
  );
};

export default Documents;
