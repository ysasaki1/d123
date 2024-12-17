// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
const db = getFirestore(app);

// ユーザーの認証状態を確認
window.addEventListener('load', () => {
    checkUserAuth(); // 認証状態を確認
});

// ユーザーの認証状態を確認する関数
async function checkUserAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ユーザーがログインしている場合の処理
            createUserDocument(user.uid).then(() => {
                document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
                loadUserPoints(user.uid);
                loadDonationHistory(user.uid);
            });
        } else {
            // 未ログイン時にリダイレクト
            alert("ログインが必要です。");
            window.location.replace('index.html');
        }
    });
}

// ログアウト機能
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert("ログアウトしました。");
        window.location.replace('index.html'); // ログアウト後にリダイレクト
    } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
        alert("ログアウトに失敗しました。もう一度お試しください。");
    }
});

// ユーザー情報を作成する関数
async function createUserDocument(uid) {
    const userDoc = doc(db, "users", uid);
    const docSnapshot = await getDoc(userDoc);

    if (!docSnapshot.exists()) {
        await setDoc(userDoc, {
            totalCharged: 0,
            totalDonated: 0
        });
    }
}

// 現在のポイントを表示する関数
async function loadUserPoints(uid) {
    const user = auth.currentUser;

    // ユーザーのチャージ総額を取得
    const chargesQuery = query(collection(db, "charges"), where("userId", "==", user.uid));
    const chargeSnapshot = await getDocs(chargesQuery);

    let totalCharged = 0;
    chargeSnapshot.forEach(doc => {
        totalCharged += doc.data().amount;
    });

    // ユーザーの寄付総額を取得
    const donationsQuery = query(collection(db, "donations"), where("userId", "==", user.uid));
    const donationSnapshot = await getDocs(donationsQuery);

    let totalDonated = 0;
    donationSnapshot.forEach(doc => {
        totalDonated += doc.data().amount;
    });

    const currentPoints = totalCharged - totalDonated;
    document.getElementById('currentPoints').innerText = `現在のポイント: ${currentPoints}`;
}

// 使用履歴を表示する関数
async function loadDonationHistory(uid) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    const donationsQuery = query(collection(db, "donations"), where("userId", "==", uid));
    const querySnapshot = await getDocs(donationsQuery);

    // 取得したデータを配列に格納
    const donations = [];
    querySnapshot.forEach(doc => {
        const data = doc.data();
        donations.push({
            ...data,
            id: doc.id, // ドキュメントIDも格納する場合
            timestamp: data.timestamp.toDate() // FirestoreのタイムスタンプをDateオブジェクトに変換
        });
    });

    // タイムスタンプで降順にソート
    donations.sort((a, b) => b.timestamp - a.timestamp);

    // ソートされたデータをリストに追加
    donations.forEach(data => {
        const formattedTime = data.timestamp.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24時間形式
        });
        
        const listItem = document.createElement('li');
        listItem.innerText = `${formattedTime}: ${data.amount}円を${data.streamer}に投げ銭`;
        historyList.appendChild(listItem);
    });
}


// ポイントチャージ機能
document.getElementById('chargePointsButton').addEventListener('click', async () => {
    const user = auth.currentUser;
    const chargeAmount = parseInt(document.getElementById('chargeAmount').value, 10);

    if (user && chargeAmount > 0) {
        const chargeData = {
            userId: user.uid,
            amount: chargeAmount,
            timestamp: new Date()
        };
        
        await addDoc(collection(db, "charges"), chargeData);
        await loadUserPoints(user.uid);
        alert(`${chargeAmount}ポイントがチャージされました！`);
    } else {
        alert("正しい金額を選択してください。");
    }
});


// ドロップダウンリストの初期状態を設定
document.addEventListener('DOMContentLoaded', () => {
    const donorSelect = document.getElementById('donorSelect');
    donorSelect.selectedIndex = -1; // 初期状態で何も選択されていない状態に設定
});

// ドロップダウンリストの選択時に外部HTMLを読み込む
document.getElementById('donorSelect').addEventListener('change', async (event) => {
    const selectedDonor = event.target.value;
    const contentArea = document.getElementById('contentArea');
    let htmlFileName = '';

    switch (selectedDonor) {
        case '1':
            htmlFileName = 'streamerA.html';
            break;
        case '2':
            htmlFileName = 'streamerB.html';
            break;
        case '3':
            htmlFileName = 'streamerC.html';
            break;
        default:
            htmlFileName = '';
            break;
    }

    if (htmlFileName) {
        try {
            const response = await fetch(htmlFileName);
            const htmlContent = await response.text();
            contentArea.innerHTML = htmlContent;

            const closeButton = document.createElement('button');
            closeButton.innerText = '閉じる';
            closeButton.style.marginTop = '10px';
            closeButton.style.display = 'block'; // ボタンをブロック要素にして幅を全体に
            closeButton.style.marginLeft = 'auto'; // 左側のマージンを自動で
            closeButton.style.marginRight = 'auto'; // 右側のマージンを自動で
            contentArea.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                contentArea.innerHTML = ''; // コンテンツをクリア
                donorSelect.selectedIndex = -1; // ドロップダウンをリセット
            });
        } catch (error) {
            console.error("HTML読み込み中にエラーが発生しました:", error);
            contentArea.innerHTML = "<p>コンテンツの読み込みに失敗しました。</p>";
        }
    } else {
        contentArea.innerHTML = ""; // 選択が解除された場合は内容をクリア
    }
});


// 寄付機能
document.getElementById('donateButton').addEventListener('click', async () => {
    const donationAmount = parseInt(document.getElementById('donationAmount').value, 10);
    const selectedDonor = document.getElementById('donorSelect').value;
    const user = auth.currentUser;

    if (!user) {
        alert("ログインしてください。");
        return;
    }

    if (isNaN(donationAmount) || donationAmount <= 0) {
        alert("有効な寄付金額を入力してください。");
        return;
    }

    const chargesQuery = query(collection(db, "charges"), where("userId", "==", user.uid));
    const chargeSnapshot = await getDocs(chargesQuery);
    let totalCharged = 0;

    chargeSnapshot.forEach(doc => {
        totalCharged += doc.data().amount;
    });

    const donationsQuery = query(collection(db, "donations"), where("userId", "==", user.uid));
    const donationSnapshot = await getDocs(donationsQuery);
    let totalDonated = 0;

    donationSnapshot.forEach(doc => {
        totalDonated += doc.data().amount;
    });

    const currentPoints = totalCharged - totalDonated;

    if (currentPoints <= 0) {
        alert("寄付にはポイントが必要です。ポイントをチャージしてください。");
        return;
    }

    if (currentPoints < donationAmount) {
        alert("ポイントが足りません。");
        return;
    }

    const donationData = {
        userId: user.uid,
        amount: donationAmount,
        timestamp: new Date(),
        streamer: selectedDonor === "1" ? "配信者A" : selectedDonor === "2" ? "配信者B" : "配信者C"
    };

    try {
        await addDoc(collection(db, "donations"), donationData);
        await loadUserPoints(user.uid);
        alert(`${donationAmount}円が${donationData.streamer}に寄付されました！`);
    } catch (error) {
        console.error("寄付処理中にエラーが発生しました:", error);
        alert("寄付処理中にエラーが発生しました。もう一度お試しください。");
    }
});

