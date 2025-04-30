import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

const adminRolls = [
  "018000000001", "091200000002", "123456789012", "987654321098", "112233445566",
  "223344556677", "334455667788", "445566778899", "556677889900", "667788990011"
];

// Tab switching
const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function showLoginTab() {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  document.getElementById('authMsg').textContent = "";
}
function showRegisterTab() {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  document.getElementById('authMsg').textContent = "";
}
loginTab.onclick = showLoginTab;
registerTab.onclick = showRegisterTab;
window.addEventListener('DOMContentLoaded', showLoginTab);

// Show message
function showMsg(msg, color="#ff4040") {
  const el = document.getElementById('authMsg');
  el.textContent = msg;
  el.style.color = color;
}

// Register
registerForm.onsubmit = async function(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const roll = document.getElementById('registerRoll').value.trim();
  const subsection = document.getElementById('registerSubsection').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (!/^\d{12}$/.test(roll)) return showMsg("Roll number must be 12 digits.");
  if (!name) return showMsg("Name is required.");
  if (!subsection) return showMsg("Please select subsection.");
  if (password.length < 6) return showMsg("Password must be at least 6 characters.");
  if (password !== confirmPassword) return showMsg("Passwords do not match.");

  const email = `${roll}@martian.com`;
  const role = adminRolls.includes(roll) ? "admin" : "student";
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name, roll, subsection, role
    });
    showMsg("Registration successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.href = role === "admin" ? "/admin.html" : "/mainpage.html";
    }, 700);
  } catch (err) {
    showMsg("Registration failed: " + (err.message || err));
  }
};

// Login
loginForm.onsubmit = async function(e) {
  e.preventDefault();
  const roll = document.getElementById('loginRoll').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!/^\d{12}$/.test(roll)) return showMsg("Roll number must be 12 digits.");
  if (password.length < 6) return showMsg("Password must be at least 6 characters.");
  const email = `${roll}@martian.com`;
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) return showMsg("Profile not found. Contact admin.");
    const data = userDoc.data();
    showMsg("Login successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.href = data.role === "admin" ? "/admin.html" : "/mainpage.html";
    }, 700);
  } catch (err) {
    showMsg("Login failed: " + (err.message || err));
  }
};

// ========== DYNAMIC STAR BACKGROUND ==========
function createStars() {
  const starBg = document.getElementById('star-bg');
  if (!starBg) return;
  starBg.innerHTML = '';
  const w = window.innerWidth, h = window.innerHeight;
  const numStars = Math.floor((w * h) / 3500);
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * w}px`;
    star.style.top = `${Math.random() * h}px`;
    star.style.animationDuration = `${3 + Math.random() * 5}s`;
    starBg.appendChild(star);
  }
}
window.addEventListener('DOMContentLoaded', createStars);
window.addEventListener('resize', createStars);

// ========== FLOAT HOVER ANIMATION FOR CARDS ==========
document.querySelectorAll('.float-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    card.style.transform = `perspective(800px) rotateY(${x/18}deg) rotateX(${-y/18}deg) scale(1.03)`;
    card.style.boxShadow = "0 16px 64px #ff8a0033, 0 6px 32px #1a1a2e88";
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = "";
    card.style.boxShadow = "";
  });
});
