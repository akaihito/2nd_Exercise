import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUser, FaUsers, FaCog } from 'react-icons/fa';
import './App.css';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <FaBars />
            </div>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h3>Menu</h3>
                    <div className="close-btn" onClick={toggleSidebar}>
                        <FaTimes />
                    </div>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/" onClick={toggleSidebar}>
                            <FaHome className="icon" /> ホーム
                        </Link>
                    </li>
                    <li>
                        <Link to="/solo" onClick={toggleSidebar}>
                            <FaUser className="icon" /> ソロ学習
                        </Link>
                    </li>
                    <li>
                        <Link to="/join" onClick={toggleSidebar}>
                            <FaUsers className="icon" /> ルーム参加
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" onClick={toggleSidebar}>
                            <FaCog className="icon" /> 設定
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Sidebar;
