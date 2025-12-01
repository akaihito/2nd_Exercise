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
    <div className="mode-select-container">
      <div className="card text-center">
        <h2>🔑 部屋に参加する</h2>
        <input
          type="text"
          placeholder="部屋IDを入力"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={enterRoom} className="btn-primary mt-10">参加する</button>
      </div>
    </div>
  );
}

export default JoinRoom;