import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function ModeSelect() {
  const navigate = useNavigate();
  const [multiStep, setMultiStep] = useState(false);

  const goSolo = () => navigate('/solo');
  const goHost = () => {
    const roomId = uuidv4().slice(0, 6);
    navigate(`/room/${roomId}`);
  };
  const goJoin = () => navigate('/join');

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>📚 StudySync モード選択</h2>
      {!multiStep ? (
        <>
          <button onClick={goSolo} style={{ margin: '10px' }}>ソロで勉強する</button>
          <button onClick={() => setMultiStep(true)} style={{ margin: '10px' }}>マルチで勉強する</button>
        </>
      ) : (
        <>
          <p>マルチモード：どちらで参加しますか？</p>
          <button onClick={goHost} style={{ margin: '10px' }}>ホストとして部屋を作成</button>
          <button onClick={goJoin} style={{ margin: '10px' }}>参加者として部屋に入る</button>
        </>
      )}
    </div>
  );
}

export default ModeSelect;