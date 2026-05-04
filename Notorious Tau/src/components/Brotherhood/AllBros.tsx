import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import { handleDelete } from "../../utils/handle";
import { FaTrash } from "react-icons/fa";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import type { BaseDocument, EventItem } from "../EventsFolder/eventData";

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
      <div className="all-events">
        <div className="brotherhood-events">
          <div className="card">
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
                    <div key={event.id} className="all-event-wrapper card">
                      <div
                        className="event-clickable"
                        onClick={() => {
                          setShowEventInfo(true);
                          setSelectedEvent(event);
                        }}
                      >
                        <h4>{event.eventTitle}</h4>
                        <p>Click for more info</p>
                      </div>
                      {userRole === "admin" && (
                        <button
                          className="trash-can-wrapper"
                          onClick={() =>
                            handleDelete(
                              "brotherhood",
                              event.id,
                              event.imagePath,
                            )
                          }
                        >
                          <FaTrash className="trash-can" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="alumni-events">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Alumni Events</h2>
              {alumniEvents.length === 0 && (
                <p className="card-text">
                  No Events Published...
                  <br />
                  Check Back Later!
                </p>
              )}
              {alumniEvents.length > 0 && (
                <div className="card-text">
                  {alumniEvents.map((event) => (
                    <div key={event.id} className="all-event-wrapper card">
                      <div
                        className="event-clickable"
                        onClick={() => {
                          setShowEventInfo(true);
                          setSelectedEvent(event);
                        }}
                      >
                        <h4>{event.eventTitle}</h4>
                        <p>Click for more info</p>
                      </div>
                      {userRole === "admin" && (
                        <button
                          className="trash-can-wrapper"
                          onClick={() => {
                            handleDelete("alumni", event.id, event.imagePath);
                          }}
                        >
                          <FaTrash className="trash-can" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="regular-events">
          <h2>Events Happening</h2>
          {events.length === 0 && (
            <p className="card-text">
              No Events Published...
              <br />
              Check Back Later!
            </p>
          )}
          {events.length > 0 &&
            events.map((event) => (
              <div key={event.id} className="all-event-wrapper card regular">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={event.imageURL}
                      className="img-fluid rounded-start"
                      alt="event-image"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h4 className="card-title">{event.eventTitle}</h4>
                      <p>{event.description}</p>
                      {event.items.length > 0 && (
                        <Fragment>
                          <h6 className="price-title">Event Prices: </h6>
                          <div className="event-prices">
                            <ul className="sell-items">
                              {event.items.map(
                                (item: EventItem, index: number) => (
                                  <li key={index}>
                                    <span className="item-name">
                                      {item.name}
                                    </span>
                                    <span className="item-price">
                                      ${item.price}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
                {userRole === "admin" && (
                  <button
                    className="trash-can-wrapper"
                    onClick={() => {
                      handleDelete("events", event.id, event.imagePath);
                    }}
                  >
                    <FaTrash className="trash-can" />
                  </button>
                )}
              </div>
            ))}
        </div>
        <div className="side-bar">
          <h3>Connect</h3>
          <ul className="connect-options">
            <li onClick={() => navigate("/Mtb")}>Active Brothers</li>
            <li onClick={() => navigate("/")}>Events</li>
            <li onClick={() => navigate("/Service")}>Service</li>
            <li>MGC Related</li>
            <li>Rush Week</li>
            <li>Collaborate?</li>
          </ul>
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
          <h4>{event.title}</h4>
          <button
            type="button"
            className="btn btn-close"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
        {event.date && (
          <p>
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
            })}
          </p>
        )}
        {event.description && <p>{event.description}</p>}
      </div>
    </div>
  );
}

export default AllBros;
