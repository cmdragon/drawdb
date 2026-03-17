import React from 'react';

const WechatPopup = ({ isVisible, onClose }) => {
  return (
    isVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <h3 className="text-xl font-bold mb-4">关注微信公众号</h3>
          <p className="mb-4">获取更多数据库设计技巧和工具使用指南</p>
          <div className="flex justify-center mb-4">
            <img 
              src="/wechat_qrcode.webp" 
              alt="微信公众号二维码" 
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">扫码关注公众号</p>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    )
  );
};

export default WechatPopup;