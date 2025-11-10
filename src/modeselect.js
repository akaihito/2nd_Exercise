// ModeSelect.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function ModeSelect() {
  const navigate = useNavigate();

  const goSolo = () => {
    navigate('/solo');
  };

  const goRoom = () => {
    const roomId = uuidv4().slice(0, 6); // 短めの部屋IDを生成
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>📚 StudySync モード選択</h2>
      <p>勉強スタイルを選んでください</p>
      <button onClick={goSolo} style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#4caf50', color: 'white' }}>
        一人で勉強する
      </button>
      <button onClick={goRoom} style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#2196f3', color: 'white' }}>
        みんなで勉強する
      </button>
    </div>
  );
}

export default ModeSelect;