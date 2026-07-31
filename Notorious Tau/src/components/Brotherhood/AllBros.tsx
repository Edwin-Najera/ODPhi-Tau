import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import {
  handlePageNavigation,
  showMessage,
  formatPhone,
} from "../../utils/handle";
import { onSnapshot, doc } from "firebase/firestore";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import EventInfoPopup from "../Admin/PopupFolder/EventInfoPopup";
import EventCard from "./EventCard";
import NoEvents from "./NoEvents";
import UserControls from "../Admin/AdminScreen/UserControls";
import PageNavigate from "./PageNavigate";
import RushWeek from "./RushWeek";
import type { BaseDocument, EventItem } from "../EventsFolder/eventData";
import { db } from "../../firebase";

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
  const [rushWeekFlyer, setRushWeekFlyer] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"rushweek" | "collaborate" | null>(
    null,
  );
  const [contactInfo, setContactInfo] = useState({
    name: "",
    chapter: "",
    number: "",
  });

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.number) {
      showMessage("Name and Phone number required", "save", setPopup);
      return;
    }

    try {
      await fetch(import.meta.env.VITE_FIREBASE_APPSCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          ...contactInfo,
          formType: "alumni",
          token: import.meta.env.VITE_FIREBASE_SECRET_TOKEN,
        }),
      });
      showMessage("Submitted successfully", "save", setPopup);
      setContactInfo({ name: "", chapter: "", number: "" });
    } catch (error) {
      console.error(error);
      showMessage("Unable to submit. Try again Later", "save", setPopup);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rushweek", "rushweek"), (snap) => {
      if (snap.exists()) setRushWeekFlyer(snap.data().flyerURL);
    });
    return () => unsub();
  });

  return (
    <div className="page all-bros-page">
      <PageNavigate
        onAdminClick={() =>
          handlePageNavigation("onlybros", navigate, userRole, setPopup)
        }
        onAllBrosClick={() =>
          handlePageNavigation("allbros", navigate, userRole, setPopup)
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
          popupType === "rushweek" ? (
            <RushWeekPopup
              onClose={() => setPopup({ show: false, message: "", type: null })}
              message={popup.message}
              flyerURL={rushWeekFlyer}
              userRole={userRole}
            />
          ) : (
            <CollaboratePopup
              onClose={() => setPopup({ show: false, message: "", type: null })}
              message={popup.message}
              handleContactChange={handleContactChange}
              handleSubmit={handleSubmit}
              contactInfo={contactInfo}
            />
          )
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
              onClick={() => {
                setPopup({ show: true, message: "Rush Week", type: "active" });
                setPopupType("rushweek");
              }}
            >
              Rush Week
            </li>
            <li
              onClick={() => {
                setPopup({
                  show: true,
                  message: "Collaborate?",
                  type: "active",
                });
                setPopupType("collaborate");
              }}
            >
              Collaborate?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const RushWeekPopup = ({
  onClose,
  message,
  flyerURL,
  userRole,
}: {
  onClose: () => void;
  message: string;
  flyerURL?: string | null;
  userRole?: string | null;
}) => {
  console.log("Rush week flyer:", flyerURL);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        {(userRole === "admin" || userRole === "active") && <RushWeek />}
        <h2>{message}</h2>
        {flyerURL ? (
          <img src={flyerURL} alt="Rush Week Flyer" className="preview-image" />
        ) : (
          <p>No flyer available yet</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const CollaboratePopup = ({
  onClose,
  handleContactChange,
  handleSubmit,
  contactInfo,
  message,
}: {
  onClose: () => void;
  handleContactChange: (field: string, value: string) => void;
  handleSubmit: () => void;
  contactInfo: {
    name: string;
    chapter: string;
    number: string;
  };
  message: string;
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{message}</h2>
        <div className="alumni-contact flex-col-center pos-relative h-100">
          <div className="card flex-col-center w-100">
            <div className="card-body flex-col">
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="alumniName"
                  placeholder="Joe Cereceres"
                  value={contactInfo.name}
                  required
                  onChange={(e) => handleContactChange("name", e.target.value)}
                />
                <label htmlFor="alumniName">Name</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="chapterName"
                  placeholder="Tau"
                  value={contactInfo.chapter}
                  required
                  onChange={(e) =>
                    handleContactChange("chapter", e.target.value)
                  }
                />
                <label htmlFor="chapterName">Chapter</label>
              </div>
              <div className="form-floating col">
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  placeholder="(123)-456-1987"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                  value={contactInfo.number}
                  onChange={(e) =>
                    handleContactChange("number", formatPhone(e.target.value))
                  }
                />
                <label htmlFor="phoneNumber" className="ms-2">
                  Phone Number
                </label>
              </div>
              <button
                className="alumni-submit flex-center w-max mt-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AllBros;
