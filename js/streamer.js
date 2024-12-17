// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyC6t0R7TrMr9CuEM-mzaNZIkh5t3Tw2VjE",
    authDomain: "d4d4-402f0.firebaseapp.com",
    projectId: "d4d4-402f0",
    storageBucket: "d4d4-402f0.firebasestorage.app",
    messagingSenderId: "933626616376",
    appId: "1:933626616376:web:ddec47f1ffebbdc56724cd",
    measurementId: "G-KRNZZVY396"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Firebase Authの初期化
const db = getFirestore(app); // Firestoreの初期化

// ユーザーの認証状態を確認
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`${user.email}さんがログイン中`);
        // ここに配信者のロジックを追加
    } else {
        window.location.href = 'index.html'; // ログインしていない場合はリダイレクト
    }
});

// その他の機能や処理を追加
document.addEventListener('DOMContentLoaded', () => {
    // DOMの準備ができたら実行するコード
    const logoutButton = document.getElementById('logoutButton');
    const backToHomeButton = document.getElementById('backToHomeButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await signOut(auth);
            window.location.href = 'index.html'; // ログアウト後にリダイレクト
        });
    }

    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // ホームに戻る
        });
    }

    // ここに他の初期化処理を追加
});
