import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import { showMessage, formatPhone } from "../../utils/handle";
import type { BaseDocument } from "../EventsFolder/eventData";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";
import EventInfoPopup from "../Admin/PopupFolder/EventInfoPopup";
import EventCard from "./EventCard";
import NoEvents from "./NoEvents";

function Alumni() {
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const [selectedEvent, setSelectedEvent] = useState<BaseDocument | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    knightName: "",
    lineNumber: "",
    number: "",
  });
  const { userRole } = useAuthRole();
  const important = useCollection({
    collectionName: "alumni",
    activeHouse: false,
    onlyPhotos: false,
  }).filter((event) => event.important);
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
  const gallery = useCollection({
    collectionName: "photos",
    activeHouse: false,
    onlyPhotos: true,
  }).filter((photo) => photo.id.startsWith("alumni_"));
  const navigate = useNavigate();

  const handlePageNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location == "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/Onlybros/AllBros");
    } else {
      showMessage("Only Admin and Actives allowed", "save", setPopup);
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.number) {
      showMessage("Name and Phone number required", "save", setPopup);
      return;
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx8sG6o7MEagboijrR3adKjmk7T95LwZfukH5LF5p5dNazhCK4pERogOpHFyAZMwgQsUA/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({ ...contactInfo, formType: "alumni" }),
        },
      );
      showMessage("Submitted successfully", "save", setPopup);
      setContactInfo({ name: "", knightName: "", lineNumber: "", number: "" });
    } catch (error) {
      console.error(error);
      showMessage("Unable to submit. Try again Later", "save", setPopup);
    }
  };

  return (
    <div className="page alumni-page">
      <div className="flex-center flex-start w-100 gap-3 m-1 ps-1 z-5">
        <button
          className="return"
          onClick={() => handlePageNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button className="return" onClick={() => handlePageNavigate("alumni")}>
          All Brothers Page
        </button>
      </div>
      {selectedEvent && (
        <EventInfoPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: "save" })}
        />
      )}
      <h1 className="page-header text-center z-5">Alumni Newsletter</h1>
      <div className="alumni-all-events w-100 gap-1">
        {/* Contact form for Alumni */}
        <div className="alumni-contact flex-col-center pos-relative h-100">
          <div className="card flex-col-center w-100">
            <div className="card-body flex-col">
              <h2 className="card-title align-self-start">Contact</h2>

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
                  id="knightName"
                  placeholder="Hype Knight"
                  value={contactInfo.knightName}
                  onChange={(e) =>
                    handleContactChange("knightName", e.target.value)
                  }
                />
                <label htmlFor="knightName">Knight Name</label>
              </div>
              <div className="row">
                <div className="form-floating col">
                  <input
                    type="text"
                    className="form-control"
                    id="lineNumber"
                    placeholder="87"
                    value={contactInfo.lineNumber}
                    onChange={(e) =>
                      handleContactChange("lineNumber", e.target.value)
                    }
                  />
                  <label htmlFor="lineNumber" className="ms-2">
                    Line Number
                  </label>
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
              </div>
              <button
                className="alumni-submit flex-center pos-absolute w-max"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* Important Events */}
        {userRole === "alumni" ||
        userRole === "active" ||
        userRole === "admin" ? (
          <div className="important-events flex-col-center w-100 h-100">
            <div className="card flex-col-center w-100">
              <div className="card-body">
                <h2 className="card-title">Important Dates</h2>
                {important.length === 0 && <NoEvents />}
                {important.length > 0 && (
                  <div className="card-text gap-3">
                    {important.map((event) => (
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
        ) : (
          <div className="important-events flex-col-center h-100">
            <div className="card flex-col-center w-100">
              <div className="card-body">
                <h2 className="card-title">Important Dates</h2>
                <p className="card-text">
                  This Tab is only for Alumni and Active Tau brothers
                  <br />
                  If you would like to know about any events contact any Active
                  Tau Brother
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Events happening related to chapter */}
        <div className="tau-events flex-col-center h-100 gap2">
          <h2>Tau Events</h2>
          {events.length === 0 && <NoEvents />}
          {events.length > 0 && (
            <div className="card-text gap-3 w-100">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  collectionName="events"
                  userRole={userRole}
                  navigate={navigate}
                  onEventClick={setSelectedEvent}
                />
              ))}
            </div>
          )}
        </div>
        {/* Brotherhood events */}
        <div className="tau-brotherhood flex-col-center h-100">
          <h2>Tau Brotherhood</h2>
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
        {/* Recents */}
        <div className="photos-side-bar flex-col-center h-100">
          <div className="card flex-col-center h-100">
            <div className="card-body flex-col-center flex-start flex-grow-1 h-100">
              <h2 className="card-title">Highlight</h2>
              <div className="continous-loop flex-col-center gap-3 flex-grow-1 w-100">
                <div className="loop-track flex-col-center gap-3 w-100">
                  {/* render twice for seamless loop */}
                  {[...gallery, ...gallery].map((photo, index) => (
                    <div
                      key={index}
                      className="alumni-image-wrapper w-75 w-100-mobile"
                    >
                      <img
                        src={photo.imageURL}
                        alt="Alumni Image"
                        className="img-fluid w-100 h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alumni;
