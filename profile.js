import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// ========== SESSION CHECK ==========
if (!localStorage.getItem('loggedIn')) {
  window.location.href = "auth/index.html";
}

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
let darkMode = true;
themeToggle.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  themeToggle.textContent = darkMode ? "🌑" : "☀️";
};
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.body.classList.add('light');
  themeToggle.textContent = "☀️";
  darkMode = false;
}

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "auth/index.html";
};

// ========== GO TO MAIN PAGE ==========
document.getElementById('gotoMainBtn').onclick = () => {
  window.location.href = "mainpage.html";
};

// ========== LOAD USER DATA ==========
async function loadProfile() {
  const roll = localStorage.getItem('roll');
  let user = {
    name: localStorage.getItem('name') || "Martian",
    roll: roll || "002410401001",
    subsection: localStorage.getItem('subsection') || "A1",
    role: localStorage.getItem('role') || "student"
  };
  // Fetch from Firestore for latest
  if (roll) {
    const userDoc = await getDoc(doc(db, "users", roll));
    if (userDoc.exists()) {
      const data = userDoc.data();
      user = { ...user, ...data };
      // Sync localStorage for instant reflection on main page
      localStorage.setItem('name', user.name);
      localStorage.setItem('subsection', user.subsection);
    }
  }
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileRoll').textContent = user.roll;
  document.getElementById('profileSubsection').textContent = user.subsection;
  document.getElementById('profileRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  document.getElementById('profileAvatar').textContent = user.role === "admin" ? "👨‍🚀" : "👩‍🚀";
  document.getElementById('adminBadge').style.display = user.role === "admin" ? "" : "none";
}
loadProfile();

// ========== EDIT NAME ==========
const editNameModal = document.getElementById('editNameModal');
document.getElementById('editNameBtn').onclick = () => {
  document.getElementById('editNameInput').value = localStorage.getItem('name') || "";
  editNameModal.classList.add('active');
};
document.getElementById('cancelEditName').onclick = () => editNameModal.classList.remove('active');
document.getElementById('editNameForm').onsubmit = async function(e) {
  e.preventDefault();
  const newName = document.getElementById('editNameInput').value;
  const roll = localStorage.getItem('roll');
  if (roll) {
    await updateDoc(doc(db, "users", roll), { name: newName });
    localStorage.setItem('name', newName);
    loadProfile();
    alert("Name updated!");
  }
  editNameModal.classList.remove('active');
};

// ========== EDIT SUBSECTION ==========
const subsectionSpan = document.getElementById('profileSubsection');
const editSubsectionBtn = document.getElementById('editSubsectionBtn');
const subsectionSelect = document.getElementById('subsectionSelect');
const saveSubsectionBtn = document.getElementById('saveSubsectionBtn');
editSubsectionBtn.onclick = () => {
  subsectionSpan.style.display = "none";
  editSubsectionBtn.style.display = "none";
  subsectionSelect.value = localStorage.getItem('subsection') || "A1";
  subsectionSelect.style.display = "";
  saveSubsectionBtn.style.display = "";
};
saveSubsectionBtn.onclick = async () => {
  const roll = localStorage.getItem('roll');
  const newSub = subsectionSelect.value;
  if (roll) {
    await updateDoc(doc(db, "users", roll), { subsection: newSub });
    localStorage.setItem('subsection', newSub);
    loadProfile();
    alert("Subsection updated!");
  }
  subsectionSpan.style.display = "";
  editSubsectionBtn.style.display = "";
  subsectionSelect.style.display = "none";
  saveSubsectionBtn.style.display = "none";
};

// ========== CHANGE PASSWORD ==========
const changePasswordModal = document.getElementById('changePasswordModal');
document.getElementById('changePasswordBtn').onclick = () => changePasswordModal.classList.add('active');
document.getElementById('cancelChangePassword').onclick = () => changePasswordModal.classList.remove('active');
document.getElementById('changePasswordForm').onsubmit = async function(e) {
  e.preventDefault();
  const oldPass = document.getElementById('oldPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  if (newPass !== confirmPass) {
    alert("New passwords do not match!");
    return;
  }
  // Firebase password update
  try {
    await auth.currentUser.updatePassword(newPass);
    alert("Password changed!");
  } catch (err) {
    alert("Failed to change password. Please re-login.");
  }
  changePasswordModal.classList.remove('active');
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
