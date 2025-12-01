// src/RoomStudy.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const socket = io('http://localhost:4000'); // サーバーのURLに合わせて変更

function RoomStudy() {
  const { roomId } = useParams();
  const location = useLocation();
  const fullUrl = `${window.location.origin}${location.pathname}`;

  const [userName, setUserName] = useState(localStorage.getItem('studysync-username') || '');
  const [duration, setDuration] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [members, setMembers] = useState({});
  const [showShareBar, setShowShareBar] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on('roomUpdate', (data) => {
      setMembers(data);
    });

    socket.on('chatUpdate', ({ userName, message }) => {
      setChatLog((prev) => [...prev, { userName, message }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    let timer;
    if (isStudying) {
      timer = setInterval(() => {
        setDuration((prev) => {
          const newTime = prev + 1;
          socket.emit('updateDuration', { roomId, duration: newTime });
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStudying, roomId]);

  const joinRoom = () => {
    if (!userName) return;
    socket.emit('joinRoom', { roomId, userName });
    setIsStudying(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccess('✅ コピーしました！');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      socket.emit('chatMessage', { roomId, userName, message: chatInput });
      setChatInput('');
    }
  };

  const memberNames = Object.values(members).map((m) => m.userName);
  const memberDurations = Object.values(members).map((m) => m.duration);

  const chartData = {
    labels: memberNames,
    datasets: [
      {
        label: '勉強時間（秒）',
        data: memberDurations,
        backgroundColor: '#4caf50',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <div className="container room-container">
      <div className="room-header">
        <h2>🧑‍🤝‍🧑 勉強ルーム：{roomId}</h2>
      </div>

      {!isStudying ? (
        <div className="card">
          <input
            type="text"
            placeholder="あなたの名前"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom} className="btn-primary" style={{ width: '100%' }}>
            勉強スタート ▶️
          </button>
        </div>
      ) : (
        <div className="card text-center">
          <p className="timer-display">⏱️ あなたの勉強時間：{duration} 秒</p>

          <button
            onClick={() => setShowShareBar(!showShareBar)}
            className="btn-secondary mb-10"
          >
            {showShareBar ? '共有バーを隠す' : '共有バーを表示'}
          </button>

          {showShareBar && (
            <div className="share-bar">
              <h3>📱 QRコードで部屋を共有</h3>
              <div style={{ background: 'white', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
                <QRCodeCanvas value={fullUrl} size={180} />
              </div>
              <p style={{ fontSize: '0.9em', color: '#555', wordBreak: 'break-all' }}>{fullUrl}</p>
              <button onClick={copyToClipboard} className="btn-secondary" style={{ padding: '6px 12px' }}>
                📋 URLをコピー
              </button>
              <span style={{ marginLeft: '10px', color: 'green' }}>{copySuccess}</span>
            </div>
          )}
        </div>
      )}

      <hr />
      <h3>📋 参加者一覧</h3>
      <div className="card">
        <ul className="log-list">
          {Object.values(members).map((m, i) => (
            <li key={i} className="log-item">
              {m.userName}：{m.duration} 秒
            </li>
          ))}
        </ul>
      </div>

      <h3>📊 勉強時間グラフ</h3>
      <div className="card">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <h3>💬 チャット</h3>
      <div className="chat-box">
        <div className="chat-log">
          {chatLog.map((msg, i) => (
            <div key={i} className="chat-message">
              <strong>{msg.userName}：</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="メッセージを入力"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button onClick={sendMessage} className="btn-primary">送信</button>
        </div>
      </div>
    </div>
  );
}

export default RoomStudy;