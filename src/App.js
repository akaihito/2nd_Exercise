import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ModeSelect from './ModeSelect.js';
import SoloStudy from './model.js';
import RoomStudy from './RoomStudy.js';
import JoinRoom from './JoinRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModeSelect />} />
        <Route path="/solo" element={<SoloStudy />} />
        <Route path="/room/:roomId" element={<RoomStudy />} />
        <Route path="/join" element={<JoinRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;