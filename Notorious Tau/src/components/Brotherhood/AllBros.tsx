import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import type { BaseDocument } from "../EventsFolder/eventData";

type EventInfoProps = {
  event: BaseDocument | null;
  onClose: () => void;
};

function AllBros() {
  const { userRole } = useAuthRole();
  const events = useCollection({
    collectionName: "events",
    activeHouse: false,
    onlyPhotos: false,
  });
  const brotherhood = useCollection({
    collectionName: "brotherhood",
    activeHouse: false,
    onlyPhotos: false,
  });
  const alumniEvents = useCollection({
    collectionName: "alumni",
    activeHouse: false,
    onlyPhotos: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BaseDocument | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location == "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/Alumni");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

  return (
    <div className="all-bros-page">
      <div className="top-of-page">
        <button
          className="return-admin"
          onClick={() => handleNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button
          className="return-admin return-previous"
          onClick={() => handleNavigate("alumni")}
        >
          Alumni Page
        </button>
      </div>
      {showEventInfo && (
        <EventInfoPopup
          event={selectedEvent}
          onClose={() => setShowEventInfo(false)}
        />
      )}
      {showPopup && (
        <Popup
          message={message}
          onClose={() => setShowPopup(false)}
          collectionName=""
          autoClose={true}
        />
      )}
      <h1 className="page-header">Tau Events</h1>
      <div className="brotherhood-events-container">
        <div className="brotherhood-events card">
          <div className="card-body">
            <h2 className="card-title">Brotherhood Events</h2>
            {brotherhood.length === 0 && (
              <p className="card-text">
                No Events Published...
                <br />
                Check Back Later!
              </p>
            )}
            {brotherhood.length > 0 && (
              <div className="card-text">
                {brotherhood.map((event) => (
                  <div
                    key={event.id}
                    className="brotherhood-event-wrapper card"
                    onClick={() => {
                      setShowEventInfo(true);
                      setSelectedEvent(event);
                    }}
                  >
                    <h4>{event.eventTitle}</h4>
                    <p>Click for more info</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventInfoPopup({ event, onClose }: EventInfoProps) {
  if (!event)
    return (
      <div className="popup-overlay">
        <div className="popup-box event-info">
          Could not load... <br />
          Try Again
        </div>
      </div>
    );
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-box event-info"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-title">
          <h4>{event.eventTitle}</h4>
          <button
            type="button"
            className="btn btn-close"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
        <p>{event.date}</p>
        <p>{event.description}</p>
      </div>
    </div>
  );
}

export default AllBros;
