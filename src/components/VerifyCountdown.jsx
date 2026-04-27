import React, { useState, useEffect } from 'react';

const VerifyCountdown = ({ seconds, onVisible }) => {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (!onVisible) return;

    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onVisible, seconds]);

  if (!onVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[9998]">
      <div className="text-sm text-gray-600">
        验证弹窗将在 <span className="font-bold text-blue-500">{countdown}</span> 秒后重新弹出
      </div>
      <div className="text-xs text-gray-400 mt-1">请先完成验证</div>
    </div>
  );
};

export default VerifyCountdown;