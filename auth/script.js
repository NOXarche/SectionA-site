// Firebase imports (for ES6 modules; if using CDN, use window.firebase)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

// Your 10 admin rolls
const adminRolls = [
  "018000000001", "091200000002", "123456789012", "987654321098", "112233445566",
  "223344556677", "334455667788", "445566778899", "556677889900", "667788990011"
];

// Tab switching (if you use tabs for login/register)
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    authForms.forEach(form => form.classList.remove('active'));
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    document.getElementById('authMsg').textContent = "";
  });
});
function showMsg(msg, color="#ff4040") {
  const el = document.getElementById('authMsg');
  el.textContent = msg;
  el.style.color = color;
}

// REGISTER
document.getElementById('registerForm').onsubmit = async function(e) {
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Save profile to Firestore with UID as key
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name, roll, subsection, role
    });
    showMsg("Registration successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.replace(role === "admin" ? "../admin.html" : "../mainpage.html");
    }, 700);
  } catch (err) {
    showMsg("Registration failed: " + err.message);
  }
};

// LOGIN
document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const roll = document.getElementById('loginRoll').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!/^\d{12}$/.test(roll)) return showMsg("Roll number must be 12 digits.");
  if (password.length < 6) return showMsg("Password must be at least 6 characters.");
  const email = `${roll}@martian.com`;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) return showMsg("Profile not found. Contact admin.");
    const data = userDoc.data();
    showMsg("Login successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.replace(data.role === "admin" ? "../admin.html" : "../mainpage.html");
    }, 700);
  } catch (err) {
    showMsg("Login failed: " + err.message);
  }
};
