import { useState } from "react";
import { useCollection } from "../../../utils/auth";
import CountdownEvent from "../../EventsFolder/CountdownEvent";

type Props = {
  onClose: () => void;
};

function CountdownPopup({ onClose }: Props) {
  const countdowns = useCollection({
    collectionName: "countdown",
    activeHouse: false,
    onlyPhotos: false,
  });
  return (
    <div className="popup-overlay">
      <div className="popup-box countdowns">
        {countdowns.length > 0 && (
          <>
            {countdowns.map((event) => (
              <div key={event.id} className="countdown-popup">
                <CountdownEvent countdown={event} />
              </div>
            ))}
          </>
        )}
        <button className="admin-btn cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CountdownPopup;
