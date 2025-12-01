import React, { useState, useEffect } from 'react';

function Settings() {
    const [userName, setUserName] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem('studysync-username');
        if (savedName) setUserName(savedName);

        const savedTheme = localStorage.getItem('studysync-theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    const saveName = () => {
        localStorage.setItem('studysync-username', userName);
        alert('ユーザー名を保存しました！');
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('studysync-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('studysync-theme', 'light');
        }
    };

    return (
        <div className="container">
            <h2>⚙️ 設定</h2>

            <div className="card">
                <h3>👤 ユーザー設定</h3>
                <p>デフォルトのユーザー名を設定します。</p>
                <input
                    type="text"
                    placeholder="ユーザー名"
                    value={userName}
                    onChange={handleNameChange}
                />
                <button onClick={saveName} className="btn-primary">保存</button>
            </div>

            <div className="card">
                <h3>🎨 テーマ設定</h3>
                <div className="theme-toggle">
                    <span>ダークモード</span>
                    <label className="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Settings;
