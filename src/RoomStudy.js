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

  const [userName, setUserName] = useState('');
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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🧑‍🤝‍🧑 勉強ルーム：{roomId}</h2>

      {!isStudying ? (
        <>
          <input
            type="text"
            placeholder="あなたの名前"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={joinRoom} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px' }}>
            勉強スタート ▶️
          </button>
        </>
      ) : (
        <>
          <p>⏱️ あなたの勉強時間：{duration} 秒</p>

          <button
            onClick={() => setShowShareBar(!showShareBar)}
            style={{ marginBottom: '10px', backgroundColor: '#2196f3', color: 'white', padding: '8px' }}
          >
            {showShareBar ? '共有バーを隠す' : '共有バーを表示'}
          </button>

          {showShareBar && (
            <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '8px' }}>
              <h3>📱 QRコードで部屋を共有</h3>
              <QRCodeCanvas value={fullUrl} size={180} />
              <p style={{ fontSize: '0.9em', color: '#555' }}>{fullUrl}</p>
              <button onClick={copyToClipboard} style={{ padding: '6px 12px' }}>
                📋 URLをコピー
              </button>
              <span style={{ marginLeft: '10px', color: 'green' }}>{copySuccess}</span>
            </div>
          )}
        </>
      )}

      <hr />
      <h3>📋 参加者一覧</h3>
      <ul>
        {Object.values(members).map((m, i) => (
          <li key={i}>
            {m.userName}：{m.duration} 秒
          </li>
        ))}
      </ul>

      <h3>📊 勉強時間グラフ</h3>
      <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <h3>💬 チャット</h3>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' }}>
          {chatLog.map((msg, i) => (
            <div key={i}>
              <strong>{msg.userName}：</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="メッセージを入力"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          style={{ width: '80%', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default RoomStudy;