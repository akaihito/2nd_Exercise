import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

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

  // 日ごとの合計
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
        borderColor: '#4caf50',   // ← 修正
        backgroundColor: '#a5d6a7',
        fill: false,
        tension: 0.2,
      },
    ],
  };

  // 累計時間
  const totalTime = logs.reduce((sum, log) => sum + log.duration, 0);

  // 称号リスト
  const titles = [
    { threshold: 0, title: '初心者' },
    { threshold: 600, title: '継続王' },
    { threshold: 1800, title: '集中マスター' },
    { threshold: 3600, title: '勉強仙人' },
    { threshold: 7200, title: '知識賢者' },
  ];

  const getTitle = (totalTime) => {
    let currentTitle = titles[0].title;
    for (const t of titles) {
      if (totalTime >= t.threshold) {
        currentTitle = t.title;
      }
    }
    return currentTitle;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📚 StudySync</h2>

      <div style={{ marginBottom: '20px' }}>
        <strong>🏅 あなたの称号：{getTitle(totalTime)}</strong><br />
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
      {logs.length === 0 ? <p>まだ記録がありません。</p> : <Line data={chartData} />}

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