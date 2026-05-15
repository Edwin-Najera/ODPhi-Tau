import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import EventInfoPopup from "../Admin/PopupFolder/EventInfoPopup";
import EventCard from "./EventCard";
import NoEvents from "./NoEvents";
import UserControls from "../Admin/AdminScreen/UserControls";
import type { BaseDocument, EventItem } from "../EventsFolder/eventData";

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
  }).filter((event) => !event.important);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BaseDocument | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePageNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location === "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/Onlybros/Alumni");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

  return (
    <div className="page all-bros-page">
      <div className="top-of-page">
        <button
          className="return"
          onClick={() => handlePageNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button className="return" onClick={() => handlePageNavigate("alumni")}>
          Alumni Page
        </button>
      </div>
      {selectedEvent && (
        <EventInfoPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {showPopup && (
        <Popup message={message} onClose={() => setShowPopup(false)} />
      )}
      <h1 className="page-header">Tau Events</h1>
      <div className="all-events">
        <div className="brotherhood-events">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Brotherhood Events</h2>
              {brotherhood.length === 0 && <NoEvents />}
              {brotherhood.length > 0 && (
                <div className="card-text">
                  {brotherhood.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      collectionName="brotherhood"
                      userRole={userRole}
                      navigate={navigate}
                      onEventClick={setSelectedEvent}
                    />
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
              {alumniEvents.length === 0 && <NoEvents />}
              {alumniEvents.length > 0 && (
                <div className="card-text">
                  {alumniEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      collectionName="alumni"
                      userRole={userRole}
                      navigate={navigate}
                      onEventClick={setSelectedEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="regular-events">
          <h2>Events Happening</h2>
          {events.length === 0 && <NoEvents />}
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
                      <h4 className="card-title">{event.title}</h4>
                      <p>{event.description}</p>
                      {event.items.length > 0 && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <UserControls
                  userRole={userRole}
                  collectionName="events"
                  event={event}
                  navigate={navigate}
                />
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

export default AllBros;
