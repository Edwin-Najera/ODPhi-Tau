import { useEffect } from "react";

import "../../global.css";

type PopupProps = {
  message: string;
  onClose: () => void;
  collectionName: string;
  autoClose?: boolean;
  showCloseButton?: boolean;
  duration?: number;
  showGallery?: boolean;
  hasDate?: boolean;
  hasItems?: boolean;
  activeHouse?: boolean;
};

function Popup({
  message,
  onClose,
  collectionName,
  autoClose = false,
  duration = 1000,
  showGallery = false,
}: PopupProps) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose, collectionName, showGallery]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Popup;
