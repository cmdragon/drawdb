import React, { useState } from 'react';
import { Button, Input } from "@douyinfe/semi-ui";

const WechatVerifyPopup = ({ isVisible, onClose, onVerifySuccess }) => {
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!verifyCode.trim()) {
      setError('请输入验证码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api2.cmdragon.cn/api/v1/wechat/verify-code/${verifyCode}`);

      if (response.ok) {
        localStorage.setItem('wechat-verify-code', verifyCode);
        onVerifySuccess();
      } else {
        setError('验证码错误，请重新输入');
        setVerifyCode('');
      }
    } catch (err) {
      setError('验证失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
        <h3 className="text-xl font-bold mb-2">关注微信公众号</h3>
        <p className="mb-4 text-gray-600">扫码关注微信公众号，获取更多实用工具和教程</p>
        <div className="flex justify-center mb-4">
          <img
            src="/wechat_qrcode.webp"
            alt="微信公众号二维码"
            className="w-48 h-48 object-contain"
          />
        </div>
        <div className="mb-4">
          <Input
            value={verifyCode}
            onChange={(value) => {
              setVerifyCode(value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="请输入验证码"
            disabled={loading}
            className="w-full"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            稍后再说
          </Button>
          <Button
            type="primary"
            onClick={handleVerify}
            loading={loading}
            className="flex-1"
          >
            验证
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WechatVerifyPopup;