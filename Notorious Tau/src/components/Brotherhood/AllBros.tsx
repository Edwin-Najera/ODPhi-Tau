import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";

import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";

function AllBros() {
  const { userRole } = useAuthRole();
  const events = useCollection({
    collectionName: "events",
    activeHouse: false,
    onlyPhotos: false,
  });
  const brotherhoodEvents = useCollection({
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
      {showPopup && (
        <Popup
          message={message}
          onClose={() => setShowPopup(false)}
          collectionName=""
          autoClose={true}
        />
      )}
      <h1 className="page-header">All Events</h1>
      <div className="all-bros-all-events">
        <h3 className="all-bros-header">Events</h3>
        <div className="all-bros-events">
          {events.map((event, index) => (
            <div className="all-bros-event-container" key={index}>
              <h2 className="all-bros-title">{event.eventTitle}</h2>
              <img
                className="img-fluid all-bros-image"
                src={event.imageURL}
                alt="event"
              />
            </div>
          ))}
        </div>
        <h3 className="all-bros-header">Brotherhood Events</h3>
        <div className="all-bros-events">
          {brotherhoodEvents.map((event, index) => (
            <div className="all-bros-event-container" key={index}>
              <div className="brotherhood-container">
                <span className="all-bros-title">{event.eventTitle}</span>
                <span className="brotherhood-description">
                  {event.description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h3 className="all-bros-header">Important Events and Dates</h3>
        <div className="all-bros-events important-events">
          {alumniEvents.map((event, index) => (
            <div className="alumni-event-container" key={index}>
              <h2 className="alumni-event-title all-bros-event-title">
                {event.eventTitle}
              </h2>
              <div className="alumni-event-date">
                {event.date?.toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllBros;
