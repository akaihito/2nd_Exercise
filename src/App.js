import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ModeSelect from './ModeSelect.js';
import SoloStudy from './SoloStudy.js';
import RoomStudy from './RoomStudy.js';
import JoinRoom from './JoinRoom';
import Sidebar from './Sidebar';
import Settings from './Settings';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<ModeSelect />} />
        <Route path="/solo" element={<SoloStudy />} />
        <Route path="/room/:roomId" element={<RoomStudy />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;