// Firebase imports (for ES6 modules; if using CDN, use window.firebase)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

// Your Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// ========== SESSION CHECK: Only admins allowed ==========
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth/index.html";
    return;
  }
  // Check Firestore for role
  const userDoc = await (await import("firebase/firestore")).getDoc(
    (await import("firebase/firestore")).doc(db, "users", user.uid)
  );
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    await signOut(auth);
    window.location.href = "auth/index.html";
    return;
  }
  // Optionally show admin greeting
  document.getElementById('adminGreeting').textContent = `Hi, ${userDoc.data().name}!`;
});

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = async () => {
  await signOut(auth);
  window.location.href = "auth/index.html";
};

// ========== ANNOUNCEMENT FORM HANDLER ==========
document.getElementById('announcementForm').onsubmit = async function(e) {
  e.preventDefault();
  const title = document.getElementById('annTitle').value;
  const desc = document.getElementById('annDesc').value;
  const date = document.getElementById('annDate').value;
  const priority = document.getElementById('annPriority').value;
  const adminMsg = document.getElementById('adminMsg');
  try {
    await addDoc(collection(db, "announcements"), {
      title, desc, date, priority, createdAt: serverTimestamp()
    });
    adminMsg.textContent = "✅ Announcement saved!";
    this.reset();
  } catch (err) {
    adminMsg.textContent = "❌ Failed to save announcement.";
  }
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

// ========== GALLERY FORM HANDLER ==========
document.getElementById('galleryForm').onsubmit = async function(e) {
  e.preventDefault();
  const img = document.getElementById('galleryImg').value;
  const caption = document.getElementById('galleryCaption').value;
  const adminMsg = document.getElementById('adminMsg');
  try {
    await addDoc(collection(db, "gallery"), {
      img, caption, uploadedAt: serverTimestamp()
    });
    adminMsg.textContent = "✅ Gallery photo saved!";
    this.reset();
  } catch (err) {
    adminMsg.textContent = "❌ Failed to save gallery photo.";
  }
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

// ========== SCHEDULE FORM HANDLER ==========
document.getElementById('scheduleForm').onsubmit = async function(e) {
  e.preventDefault();
  const subsection = document.getElementById('schedSubsection').value;
  const subject = document.getElementById('schedSubject').value;
  const time = document.getElementById('schedTime').value;
  const location = document.getElementById('schedLocation').value;
  const adminMsg = document.getElementById('adminMsg');
  try {
    await addDoc(collection(db, "schedule"), {
      subsection, subject, time, location, createdAt: serverTimestamp()
    });
    adminMsg.textContent = "✅ Schedule entry saved!";
    this.reset();
  } catch (err) {
    adminMsg.textContent = "❌ Failed to save schedule entry.";
  }
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

// ========== EVENT FORM HANDLER ==========
document.getElementById('eventForm').onsubmit = async function(e) {
  e.preventDefault();
  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const rsvp = document.getElementById('eventRSVP').value;
  const adminMsg = document.getElementById('adminMsg');
  try {
    await addDoc(collection(db, "events"), {
      title, date, rsvp, createdAt: serverTimestamp()
    });
    adminMsg.textContent = "✅ Event saved!";
    this.reset();
  } catch (err) {
    adminMsg.textContent = "❌ Failed to save event.";
  }
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

// ========== RESOURCE FORM HANDLER ==========
document.getElementById('resourceForm').onsubmit = async function(e) {
  e.preventDefault();
  const title = document.getElementById('resTitle').value;
  const type = document.getElementById('resType').value;
  const link = document.getElementById('resLink').value;
  const adminMsg = document.getElementById('adminMsg');
  try {
    await addDoc(collection(db, "resources"), {
      title, type, link, uploadedAt: serverTimestamp()
    });
    adminMsg.textContent = "✅ Resource saved!";
    this.reset();
  } catch (err) {
    adminMsg.textContent = "❌ Failed to save resource.";
  }
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};
