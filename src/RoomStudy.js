// src/RoomStudy.js
import React, { useEffect, useState, useCallback } from 'react';
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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const socket = io(API_URL);

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

  // -------------------------
  // ✅ joinRoom を useCallback でメモ化
  // -------------------------
  const joinRoom = useCallback(
    (startDuration = 0) => {
      if (typeof startDuration !== 'number') {
        const savedRoomId = localStorage.getItem('studysync_room_id');
        if (savedRoomId === roomId) {
          startDuration = parseInt(localStorage.getItem('studysync_duration') || '0', 10);
        } else {
          startDuration = 0;
        }
      }

      if (!userName) return;

      socket.emit('joinRoom', { roomId, userName, duration: startDuration });
      setIsStudying(true);
      setDuration(startDuration);

      localStorage.setItem('studysync-username', userName);
      localStorage.setItem('studysync_room_id', roomId);
      localStorage.setItem('studysync_is_studying', 'true');
      localStorage.setItem('studysync_duration', startDuration.toString());
    },
    [roomId, userName]
  );

  // -------------------------
  // ソケットイベント登録
  // -------------------------
  useEffect(() => {
    const handleRoomUpdate = (data) => setMembers(data);
    const handleChatUpdate = ({ userName, message }) =>
      setChatLog((prev) => [...prev, { userName, message }]);
    const handleChatHistory = (history) => setChatLog(history);

    socket.on('roomUpdate', handleRoomUpdate);
    socket.on('chatUpdate', handleChatUpdate);
    socket.on('chatHistory', handleChatHistory);

    socket.on('connect', () => {
      if (isStudying && userName) {
        joinRoom(duration);
      }
    });

    return () => {
      socket.off('roomUpdate', handleRoomUpdate);
      socket.off('chatUpdate', handleChatUpdate);
      socket.off('chatHistory', handleChatHistory);
      socket.off('connect');
    };
  }, [roomId, isStudying, userName, duration, joinRoom]);

  // -------------------------
  // 自動復帰
  // -------------------------
  useEffect(() => {
    const savedRoomId = localStorage.getItem('studysync_room_id');
    const savedIsStudying = localStorage.getItem('studysync_is_studying');
    const savedDuration = parseInt(localStorage.getItem('studysync_duration') || '0', 10);

    if (savedRoomId === roomId && savedIsStudying === 'true' && userName) {
      joinRoom(savedDuration);
    }
  }, [roomId, userName, joinRoom]);

  // -------------------------
  // タイマー
  // -------------------------
  useEffect(() => {
    let timer;
    if (isStudying) {
      timer = setInterval(() => {
        setDuration((prev) => {
          const newTime = prev + 1;
          socket.emit('updateDuration', { roomId, duration: newTime });

          localStorage.setItem('studysync_room_id', roomId);
          localStorage.setItem('studysync_is_studying', 'true');
          localStorage.setItem('studysync_duration', newTime.toString());

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStudying, roomId]);

  // -------------------------
  // その他の関数
  // -------------------------
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

  const leaveRoom = () => {
    socket.disconnect();
    socket.connect();
    setIsStudying(false);
  };

  const exitRoom = () => {
    socket.disconnect();
    socket.connect();
    setIsStudying(false);
    setDuration(0);
    setUserName('');

    localStorage.removeItem('studysync-username');
    localStorage.removeItem('studysync_room_id');
    localStorage.removeItem('studysync_is_studying');
    localStorage.removeItem('studysync_duration');
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
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } },
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
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button onClick={joinRoom} className="btn-primary" style={{ width: '100%' }}>
            勉強スタート ▶️
          </button>
        </div>
      ) : (
        <div className="card text-center">
          <p className="timer-display">⏱️ あなたの勉強時間：{duration} 秒</p>

          <div style={{ margin: '20px 0' }}>
            <button
              onClick={() => setShowShareBar(!showShareBar)}
              className="btn-secondary"
            >
              {showShareBar ? '共有バーを隠す' : '共有バーを表示'}
            </button>

            <button
              onClick={leaveRoom}
              className="btn-secondary"
              style={{ marginLeft: '10px', backgroundColor: '#ffc107', color: '#000' }}
            >
              一時退出 ⏸️
            </button>

            <button
              onClick={exitRoom}
              className="btn-danger"
              style={{ marginLeft: '10px' }}
            >
              退出 🚪
            </button>
          </div>

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
              {m.userName}{m.isHost ? ' (ホスト)' : ''}：{m.duration} 秒
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
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{ marginBottom: 0 }}
          />
          <button onClick={sendMessage} className="btn-primary chat-send-btn">送信</button>
        </div>
      </div>
    </div>
  );
}

export default RoomStudy;