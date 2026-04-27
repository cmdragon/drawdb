import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect, useState, useCallback, useRef } from "react";
import Editor from "./pages/Editor";
import BugReport from "./pages/BugReport";
import Templates from "./pages/Templates";
import SettingsContextProvider from "./context/SettingsContext";
import { useSettings } from "./hooks";
import NotFound from "./pages/NotFound";
import WechatVerifyPopup from "./components/WechatVerifyPopup";
import VerifyCountdown from "./components/VerifyCountdown";

function VerifyProvider({ children }) {
  const [verifyPopupVisible, setVerifyPopupVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const location = useLocation();
  const recheckTimeoutRef = useRef(null);

  const verifyCode = useCallback(async () => {
    const storedCode = localStorage.getItem('wechat-verify-code');
    if (!storedCode) {
      setVerifyPopupVisible(true);
      setShowCountdown(false);
      return;
    }

    try {
      const response = await fetch(`https://api2.cmdragon.cn/api/v1/wechat/verify-code/${storedCode}`);
      if (response.ok) {
        setIsVerified(true);
        setVerifyPopupVisible(false);
        setShowCountdown(false);
      } else {
        localStorage.removeItem('wechat-verify-code');
        setIsVerified(false);
        setVerifyPopupVisible(true);
        setShowCountdown(false);
      }
    } catch (err) {
      setIsVerified(false);
      setVerifyPopupVisible(true);
      setShowCountdown(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isVerified) {
      verifyCode();
    }
  }, [location.pathname, isVerified, verifyCode]);

  const handleVerifySuccess = () => {
    setIsVerified(true);
    setVerifyPopupVisible(false);
    setShowCountdown(false);
    if (recheckTimeoutRef.current) {
      clearTimeout(recheckTimeoutRef.current);
    }
  };

  const handleClosePopup = () => {
    setVerifyPopupVisible(false);
    if (!isVerified) {
      setShowCountdown(true);
      recheckTimeoutRef.current = setTimeout(() => {
        setVerifyPopupVisible(true);
        setShowCountdown(false);
      }, 5000);
    }
  };

  return (
    <>
      {!isVerified && (
        <WechatVerifyPopup
          isVisible={verifyPopupVisible}
          onClose={handleClosePopup}
          onVerifySuccess={handleVerifySuccess}
        />
      )}
      {showCountdown && <VerifyCountdown seconds={5} onVisible={showCountdown} />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <SettingsContextProvider>
      <BrowserRouter>
        <VerifyProvider>
          <RestoreScroll />
          <Routes>
            <Route
              path="/"
              element={
                <ThemedPage>
                  <Editor />
                </ThemedPage>
              }
            />
            <Route
              path="/bug-report"
              element={
                <ThemedPage>
                  <BugReport />
                </ThemedPage>
              }
            />
            <Route path="/templates" element={<Templates />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VerifyProvider>
      </BrowserRouter>
    </SettingsContextProvider>
  );
}

function ThemedPage({ children }) {
  const { setSettings } = useSettings();

  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setSettings((prev) => ({ ...prev, mode: "dark" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "dark");
      }
    } else {
      setSettings((prev) => ({ ...prev, mode: "light" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "light");
      }
    }
  }, [setSettings]);

  return children;
}

function RestoreScroll() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scroll(0, 0);
  }, [location.pathname]);
  return null;
}