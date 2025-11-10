// JoinRoom.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const enterRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>🔑 部屋に参加する</h2>
      <input
        type="text"
        placeholder="部屋IDを入力"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <br />
      <button onClick={enterRoom}>参加する</button>
    </div>
  );
}

export default JoinRoom;