import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import StudyPanel from './StudyPanel';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

function SoloStudy() {
  const [isStudying, setIsStudying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [memo, setMemo] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('国語'); // 学習開始時に選択する教科
  const [filterSubjects, setFilterSubjects] = useState([]); // フィルタリング用

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
      subject: selectedSubject, // 教科を保存
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('studysync-logs', JSON.stringify(updatedLogs));
    setIsStudying(false);
    setMemo('');
  };

  // フィルタリング処理
  const toggleFilter = (subject) => {
    setFilterSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const filteredLogs = filterSubjects.length > 0
    ? logs.filter((log) => filterSubjects.includes(log.subject))
    : logs;

  // 日ごとの合計 (フィルタリング適用後)
  const dailyTotals = filteredLogs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.duration;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(dailyTotals),
    datasets: [
      {
        label: '勉強時間（秒）',
        data: Object.values(dailyTotals),
        borderColor: '#4caf50',
        backgroundColor: '#a5d6a7',
        fill: false,
        tension: 0.2,
      },
    ],
  };

  // 累計時間 (フィルタリング適用後)
  const totalTime = filteredLogs.reduce((sum, log) => sum + log.duration, 0);

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

  const subjects = ['国語', '数学', '現代社会', '英語', '理科'];

  return (
    <div className="study-layout">
      <StudyPanel filterSubjects={filterSubjects} toggleFilter={toggleFilter} />

      <div className="study-main">
        <div className="container study-container" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
          <h2>📚 StudySync</h2>

          <div className="card text-center mb-20">
            <strong>🏅 あなたの称号：{getTitle(totalTime)}</strong><br />
            {filterSubjects.length > 0 ? (
              <span>絞り込み中: {filterSubjects.join(', ')} の</span>
            ) : (
              <span>全体の</span>
            )}
            累計勉強時間：{totalTime} 秒
          </div>

          {isStudying ? (
            <div className="card">
              <p className="timer-display text-center">
                ⏱️ 勉強中 ({selectedSubject})：{duration} 秒
              </p>
              <textarea
                placeholder="勉強内容や気分をメモ..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows="3"
              />
              <button onClick={endSession} className="btn-danger" style={{ width: '100%' }}>
                セッション終了
              </button>
            </div>
          ) : (
            <div className="card text-center mb-20">
              <p className="mb-10">教科を選択してスタート！</p>
              <div className="mb-20">
                {subjects.map((sub) => (
                  <label key={sub} style={{ marginRight: '15px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="subject"
                      value={sub}
                      checked={selectedSubject === sub}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      style={{ width: 'auto', marginRight: '5px' }}
                    />
                    {sub}
                  </label>
                ))}
              </div>
              <button onClick={startSession} className="btn-primary">
                勉強スタート ▶️
              </button>
            </div>
          )}

          <hr />
          <h3>📊 勉強時間の推移</h3>
          <div className="card">
            {filteredLogs.length === 0 ? <p>まだ記録がありません。</p> : <Line data={chartData} />}
          </div>

          <hr />
          <h3>📝 過去の勉強ログ</h3>
          <ul className="log-list">
            {filteredLogs.map((log, index) => (
              <li key={index} className="log-item">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{log.time}</strong>
                  <span className="tag" style={{ backgroundColor: '#e9ecef', fontSize: '0.8rem' }}>
                    {log.subject || '未設定'}
                  </span>
                </div>
                🕒 {log.duration} 秒<br />
                ✏️ {log.memo || '（メモなし）'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SoloStudy;