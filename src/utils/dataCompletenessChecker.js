const checkDataCompleteness = (profileData, documentData) => {
  // Check UserProfile.jsx mandatory fields
  const isProfileComplete =
    profileData.name &&
    profileData.email &&
    profileData.phone &&
    profileData.domicile &&
    profileData.address &&
    profileData.ktpAddress &&
    profileData.nik &&
    profileData.lastEducation &&
    profileData.gpa &&
    profileData.major &&
    profileData.religion &&
    profileData.height &&
    profileData.weight &&
    profileData.skills;

  // Check UserDocuments.jsx mandatory fields (CV, Pas Foto, KTP)
  const isDocumentsComplete =
    documentData.cvFile &&
    documentData.pasFotoFile &&
    documentData.ktpFile;

  return isProfileComplete && isDocumentsComplete;
};

export default checkDataCompleteness;
