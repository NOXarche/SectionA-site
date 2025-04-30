// Firebase v9+ modular imports (for modules; for CDN, use window.firebase)
import { initializeApp } from "firebase/app";
import { getAuth, signOut, updatePassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDlFYzg5Te2jz-kVKXd0yGYlJkMwU9fxss",
  authDomain: "ju-civil-a-martian.firebaseapp.com",
  projectId: "ju-civil-a-martian",
  storageBucket: "ju-civil-a-martian.appspot.com",
  messagingSenderId: "247448010406",
  appId: "1:247448010406:web:a2efa79a4080513cc87e67",
  measurementId: "G-BXYMLKE395"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========== SESSION CHECK & REAL-TIME PROFILE FETCH ==========
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth/index.html";
    return;
  }
  const userDocRef = doc(db, "users", user.uid);
  // Real-time listener for profile data
  onSnapshot(userDocRef, (docSnap) => {
    if (!docSnap.exists()) {
      alert("Profile not found!");
      signOut(auth);
      window.location.href = "auth/index.html";
      return;
    }
    renderProfile(docSnap.data());
  });

  // ========== LOGOUT ==========
  document.getElementById('logoutBtn').onclick = async () => {
    await signOut(auth);
    window.location.href = "auth/index.html";
  };

  // ========== GO TO MAIN PAGE ==========
  document.getElementById('gotoMainBtn').onclick = () => {
    window.location.href = "mainpage.html";
  };

  // ========== EDIT NAME ==========
  document.getElementById('editNameBtn').onclick = () => {
    document.getElementById('editNameInput').value = document.getElementById('profileName').textContent;
    document.getElementById('editNameModal').classList.add('active');
  };
  document.getElementById('cancelEditName').onclick = () => document.getElementById('editNameModal').classList.remove('active');
  document.getElementById('editNameForm').onsubmit = async function(e) {
    e.preventDefault();
    const newName = document.getElementById('editNameInput').value;
    await updateDoc(userDocRef, { name: newName });
    document.getElementById('editNameModal').classList.remove('active');
    alert("Name updated!");
  };

  // ========== EDIT SUBSECTION ==========
  const subsectionSpan = document.getElementById('profileSubsection');
  const editSubsectionBtn = document.getElementById('editSubsectionBtn');
  const subsectionSelect = document.getElementById('subsectionSelect');
  const saveSubsectionBtn = document.getElementById('saveSubsectionBtn');
  editSubsectionBtn.onclick = () => {
    subsectionSpan.style.display = "none";
    editSubsectionBtn.style.display = "none";
    subsectionSelect.value = subsectionSpan.textContent;
    subsectionSelect.style.display = "";
    saveSubsectionBtn.style.display = "";
  };
  saveSubsectionBtn.onclick = async () => {
    const newSub = subsectionSelect.value;
    await updateDoc(userDocRef, { subsection: newSub });
    subsectionSpan.style.display = "";
    editSubsectionBtn.style.display = "";
    subsectionSelect.style.display = "none";
    saveSubsectionBtn.style.display = "none";
    alert("Subsection updated!");
  };

  // ========== CHANGE PASSWORD ==========
  document.getElementById('changePasswordBtn').onclick = () => document.getElementById('changePasswordModal').classList.add('active');
  document.getElementById('cancelChangePassword').onclick = () => document.getElementById('changePasswordModal').classList.remove('active');
  document.getElementById('changePasswordForm').onsubmit = async function(e) {
    e.preventDefault();
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    if (newPass !== confirmPass) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await updatePassword(user, newPass);
      alert("Password changed!");
    } catch (err) {
      alert("Failed to change password. Please re-login.");
    }
    document.getElementById('changePasswordModal').classList.remove('active');
  };

  // ========== FLOAT HOVER ANIMATION FOR CARD ==========
  const floatCard = document.querySelector('.float-card');
  if (floatCard) {
    floatCard.addEventListener('mousemove', (e) => {
      const rect = floatCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      floatCard.style.transform = `perspective(800px) rotateY(${x/18}deg) rotateX(${-y/18}deg) scale(1.03)`;
      floatCard.style.boxShadow = "0 16px 64px #ff8a0033, 0 6px 32px #1a1a2e88";
    });
    floatCard.addEventListener('mouseleave', () => {
      floatCard.style.transform = "";
      floatCard.style.boxShadow = "";
    });
  }
});

// ========== PROFILE RENDER FUNCTION ==========
function renderProfile(data) {
  document.getElementById('profileName').textContent = data.name;
  document.getElementById('profileRoll').textContent = data.roll;
  document.getElementById('profileSubsection').textContent = data.subsection;
  document.getElementById('profileRole').textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1);
  document.getElementById('profileAvatar').textContent = data.role === "admin" ? "👨‍🚀" : "👩‍🚀";
  document.getElementById('adminBadge').style.display = data.role === "admin" ? "" : "none";
}
