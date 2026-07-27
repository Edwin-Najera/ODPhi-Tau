import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import { handlePageNavigation } from "../../utils/handle";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import EventInfoPopup from "../Admin/PopupFolder/EventInfoPopup";
import EventCard from "./EventCard";
import NoEvents from "./NoEvents";
import UserControls from "../Admin/AdminScreen/UserControls";
import PageNavigate from "./PageNavigate";
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

  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const [selectedEvent, setSelectedEvent] = useState<BaseDocument | null>(null);
  const navigate = useNavigate();

  return (
    <div className="page all-bros-page">
      <PageNavigate
        onAdminClick={() =>
          handlePageNavigation("onlybros", navigate, userRole, setPopup)
        }
        onAllBrosClick={() =>
          handlePageNavigation("alumni", navigate, userRole, setPopup)
        }
        location={location.pathname}
        userRole={userRole}
      />
      {selectedEvent && (
        <EventInfoPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {popup.show &&
        (popup.type === "active" ? (
          <RushWeekPopup
            onClose={() => setPopup({ show: false, message: "", type: null })}
            message={popup.message}
          />
        ) : (
          <Popup
            message={popup.message}
            onClose={() => setPopup({ show: false, message: "", type: null })}
          />
        ))}
      <h1 className="page-header text-center z-5">Tau Events</h1>
      <div className="all-events w-100 gap-1">
        <div className="brotherhood-events flex-col-center h-100">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="card-title align-self-start">
                Brotherhood Events
              </h2>
              {brotherhood.length === 0 && <NoEvents />}
              {brotherhood.length > 0 && (
                <div className="card-text gap-3">
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
        <div className="alumni-events flex-col-center h-100">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="card-title align-self-start">Alumni Events</h2>
              {alumniEvents.length === 0 && <NoEvents />}
              {alumniEvents.length > 0 && (
                <div className="card-text gap-3">
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
        <div className="regular-events flex-col-center h-100 gap-2">
          <h2>Events Happening</h2>
          {events.length === 0 && <NoEvents />}
          {events.length > 0 &&
            events.map((event) => (
              <div
                key={event.id}
                className="card regular pointer flex-col flex-between pos-relative w-100"
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={event.imageURL}
                      className="img-fluid rounded-start"
                      alt="event-image"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body flex-col-center text-start flex-grow-1 h-100">
                      <h4 className="card-title align-self-start">
                        {event.title}
                      </h4>
                      <p>{event.description}</p>
                      {event.items.length > 0 && (
                        <>
                          <h6 className="align-self-start">Event Prices: </h6>
                          <div className="event-prices flex-grow-1">
                            <ul className="sell-items flex-col flex-around h-100">
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
        <div className="side-bar flex-col-center h-100 gap-2">
          <h3>Connect</h3>
          <ul className="connect-options flex-col flex-around flex-grow-1 p-2">
            <li onClick={() => navigate("/Mtb")}>Active Brothers</li>
            <li onClick={() => navigate("/")}>Events</li>
            <li onClick={() => navigate("/Service")}>Service</li>
            <li>MGC Related</li>
            <li
              onClick={() =>
                setPopup({ show: true, message: "Rush Week", type: "active" })
              }
            >
              Rush Week
            </li>
            <li>Collaborate?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const RushWeekPopup = ({
  onClose,
  message,
}: {
  onClose: () => void;
  message: string;
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{message}</h2>
        <img alt="Rush-Week-Flyer" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AllBros;
