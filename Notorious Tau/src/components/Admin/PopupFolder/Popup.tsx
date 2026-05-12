import { useEffect } from "react";

import "../../global.css";

type PopupProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

function Popup({ message, onClose, duration = 1000 }: PopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Popup;
