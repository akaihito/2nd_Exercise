import React from 'react';
import { FaTimes } from 'react-icons/fa';

function StudyPanel() {
    return (
        <div className="study-panel">
            <div className="panel-section">
                <h4>教科</h4>
                <div className="tags">
                    <span className="tag">国語 <FaTimes className="tag-close" /></span>
                    <span className="tag">数学 <FaTimes className="tag-close" /></span>
                    <span className="tag">現代社会 <FaTimes className="tag-close" /></span>
                </div>
            </div>

            <div className="panel-section">
                <div className="checkbox-item">
                    <input type="checkbox" id="basic" defaultChecked />
                    <label htmlFor="basic">
                        <span className="label-text">基礎</span>
                        <span className="date">2025/01/1</span>
                    </label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" id="applied" defaultChecked />
                    <label htmlFor="applied">
                        <span className="label-text">応用</span>
                        <span className="date">2025/05/5</span>
                    </label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" id="hard" defaultChecked />
                    <label htmlFor="hard">
                        <span className="label-text">超難問</span>
                        <span className="date">なし</span>
                    </label>
                </div>
            </div>

            <div className="panel-section">
                <div className="slider-labels">
                    <span>基礎</span>
                    <span>超難問</span>
                </div>
                <input type="range" min="0" max="100" className="difficulty-slider" />
            </div>

            <div className="panel-section">
                <h4>インデックス</h4>
                <div className="checkbox-list">
                    <div className="checkbox-simple">
                        <input type="checkbox" id="idx-official" defaultChecked />
                        <label htmlFor="idx-official">公式</label>
                    </div>
                    <div className="checkbox-simple">
                        <input type="checkbox" id="idx-word" defaultChecked />
                        <label htmlFor="idx-word">単語</label>
                    </div>
                    <div className="checkbox-simple">
                        <input type="checkbox" id="idx-point" defaultChecked />
                        <label htmlFor="idx-point">要点</label>
                    </div>
                </div>
            </div>

            <div className="panel-section">
                <h4>課題</h4>
                <div className="checkbox-list">
                    <div className="checkbox-simple">
                        <input type="checkbox" id="task-past" defaultChecked />
                        <label htmlFor="task-past">宿題</label>
                    </div>
                    <div className="checkbox-simple">
                        <input type="checkbox" id="task-quiz" defaultChecked />
                        <label htmlFor="task-quiz">小テスト</label>
                    </div>
                    <div className="checkbox-simple">
                        <input type="checkbox" id="task-final" defaultChecked />
                        <label htmlFor="task-final">期末テスト</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudyPanel;
