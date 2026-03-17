import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Editor from "./pages/Editor";
import BugReport from "./pages/BugReport";
import Templates from "./pages/Templates";
import SettingsContextProvider from "./context/SettingsContext";
import { useSettings } from "./hooks";
import NotFound from "./pages/NotFound";
import WechatPopup from "./components/WechatPopup";

export default function App() {
  const [wechatPopupVisible, setWechatPopupVisible] = useState(true);

  const openWechatPopup = () => {
    setWechatPopupVisible(true);
  };

  const closeWechatPopup = () => {
    setWechatPopupVisible(false);
  };

  return (
    <SettingsContextProvider>
      <BrowserRouter>
        <RestoreScroll />
        <WechatPopup 
          isVisible={wechatPopupVisible} 
          onClose={closeWechatPopup} 
        />
        <Routes>
          <Route
            path="/"
            element={
              <ThemedPage>
                <Editor openWechatPopup={openWechatPopup} />
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
