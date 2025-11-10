import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

function SoloStudy() {
  const [isStudying, setIsStudying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [memo, setMemo] = useState('');
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('studysync-logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    let timer;
    if (isStudying) {
      timer = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStudying, startTime]);

  const startSession = () => {
    setStartTime(Date.now());
    setDuration(0);
    setIsStudying(true);
  };

  const endSession = () => {
    const newLog = {
      time: new Date().toLocaleString(),
      date: new Date().toISOString().split('T')[0],
      duration,
      memo,
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('studysync-logs', JSON.stringify(updatedLogs));
    setIsStudying(false);
    setMemo('');
  };

  const dailyTotals = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.duration;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(dailyTotals),
    datasets: [
      {
        label: '勉強時間（秒）',
        data: Object.values(dailyTotals),
        backgroundColor: '#4caf50',
      },
    ],
  };

  const totalTime = logs.reduce((sum, log) => sum + log.duration, 0);
  let level = 1;
  let title = '初心者';
  if (totalTime >= 3600) {
    level = 4;
    title = '勉強仙人';
  } else if (totalTime >= 1800) {
    level = 3;
    title = '集中マスター';
  } else if (totalTime >= 600) {
    level = 2;
    title = '継続王';
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📚 StudySync</h2>

      <div style={{ marginBottom: '20px' }}>
        <strong>🧠 あなたのレベル：Lv.{level}（{title}）</strong><br />
        累計勉強時間：{totalTime} 秒
      </div>

      {isStudying ? (
        <>
          <p>⏱️ 勉強中：{duration} 秒</p>
          <textarea
            placeholder="勉強内容や気分をメモ..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', height: '80px', marginBottom: '10px' }}
          />
          <button onClick={endSession} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px' }}>
            セッション終了
          </button>
        </>
      ) : (
        <button onClick={startSession} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px' }}>
          勉強スタート ▶️
        </button>
      )}

      <hr />
      <h3>📊 勉強時間の推移</h3>
      {logs.length === 0 ? <p>まだ記録がありません。</p> : <Bar data={chartData} />}

      <hr />
      <h3>📝 過去の勉強ログ</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {logs.map((log, index) => (
          <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{log.time}</strong><br />
            🕒 {log.duration} 秒<br />
            ✏️ {log.memo || '（メモなし）'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SoloStudy;