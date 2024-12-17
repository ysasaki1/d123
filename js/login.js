// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth(app);

// ユーザー登録
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('メールアドレスとパスワードを入力してください。');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('ユーザー登録成功');
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        showError(error.message);
    }
});

// ログイン
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showError('メールアドレスとパスワードを入力してください。');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        showError(error.message);
    }
});

// エラーメッセージの表示
function showError(message) {
    const modalMessage = document.getElementById('modalMessage');
    const errorModal = document.getElementById('errorModal');

    modalMessage.innerText = message;
    errorModal.style.display = 'block';
}

// モーダルを閉じる
document.getElementById('closeModal').onclick = function() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none';
};

// モーダルの外側をクリックして閉じる機能
document.getElementById('errorModal').onclick = function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
}
