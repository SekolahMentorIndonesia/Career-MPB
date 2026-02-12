import React from 'react';
import { BookOpen } from 'lucide-react';

const EducationDataForm = ({
  isEditing,
  lastEducation, setLastEducation,
  gpa, setGpa,
  major, setMajor,
  skills, setSkills,
  missingFields = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">PENDIDIKAN</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="last-education" className={`block text-sm font-semibold mb-1 ${missingFields.includes('last_education') ? 'text-rose-600' : 'text-gray-700'}`}>
            Pendidikan Terakhir
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="last-education"
              id="last-education"
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 ${isEditing
                ? (missingFields.includes('last_education') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white")
                : (missingFields.includes('last_education') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              value={lastEducation}
              onChange={(e) => setLastEducation(e.target.value)}
            >
              <option value="">Pilih Pendidikan Terakhir</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
              <option value="MA">MA</option>
              <option value="D1">D1</option>
              <option value="D2">D2</option>
              <option value="D3">D3</option>
              <option value="D4">D4</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="major" className={`block text-sm font-semibold mb-1 ${missingFields.includes('major') ? 'text-rose-600' : 'text-gray-700'}`}>
            Jurusan
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="major"
              id="major"
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 ${isEditing
                ? (missingFields.includes('major') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white")
                : (missingFields.includes('major') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Contoh: Teknik Informatika"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="gpa" className={`block text-sm font-semibold mb-1 ${missingFields.includes('gpa') ? 'text-rose-600' : 'text-gray-700'}`}>
            Nilai Akhir/IPK
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="gpa"
              id="gpa"
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 ${isEditing
                ? (missingFields.includes('gpa') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white")
                : (missingFields.includes('gpa') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Contoh: 3.50"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className={`block text-sm font-semibold mb-1 ${missingFields.includes('skills') ? 'text-rose-600' : 'text-gray-700'}`}>
            Keahlian
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="skills"
              id="skills"
              rows="3"
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 ${isEditing
                ? (missingFields.includes('skills') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white")
                : (missingFields.includes('skills') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Sebutkan keahlian Anda"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDataForm;
