import React from 'react';
import './MobileFrame.css';

export const MobileFrame = ({ deviceType, children, isDarkMode }) => {
  return (
    <div className={`mobile-frame ${deviceType} ${isDarkMode ? 'dark' : 'light'}`}>
      {deviceType === 'iphone' && (
        <>
          <div className="notch"></div>
          <div className="home-indicator"></div>
          <div className="iphone-status-bar">
            <span className="time">11:45</span>
            <div className="status-icons">
              <span>🔔</span>
              <span>🔗</span>
              <span>📳</span>
              <span>5G</span>
              <span>📶</span>
              <span>50%</span>
              <span>🔋</span>
            </div>
          </div>
        </>
      )}
      
      {deviceType === 'android' && (
        <div className="android-status-bar">
          <span className="time">21:08</span>
          <div className="status-icons">
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>
      )}
      
      <div className="mobile-screen">
        {children}
      </div>
    </div>
  );
};