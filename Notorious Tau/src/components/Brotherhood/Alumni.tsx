import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import { handleDelete, handleNavigate, showMessage } from "../../utils/handle";
import type { BaseDocument } from "../EventsFolder/eventData";
import { FaTrash } from "react-icons/fa";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";

function Alumni() {
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const [showEventInfo, setShowEventInfo] = useState(false);
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
    collectionName: "gallery",
    activeHouse: false,
    onlyPhotos: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePageNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location == "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/AllBros");
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
        "https://script.google.com/macros/s/AKfycbxzvMpZAUSxahGIOfKRFa-DTxWaIzmScXeDA0sWSbrtq41P8aFbsGlYjNcYHGeUEb6y7Q/exec",
        {
          method: "POST",
          body: JSON.stringify(contactInfo),
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
    <div className="alumni-page">
      <div className="top-of-page">
        <button
          className="return-admin"
          onClick={() => handlePageNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button
          className="return-admin return-previous"
          onClick={() => handlePageNavigate("alumni")}
        >
          Brotherhood Page
        </button>
      </div>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: "save" })}
          collectionName=""
          autoClose={true}
        />
      )}
      <h1 className="page-header">Alumni Newsletter</h1>
      <div className="alumni-all-events">
        {/* Contact form for Alumni */}
        <div className="alumni-contact">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Contact</h2>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="alumniName"
                  placeholder="Joe Cereceres"
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
                    type="phone"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="(123)-456-1987"
                    onChange={(e) =>
                      handleContactChange("number", e.target.value)
                    }
                  />
                  <label htmlFor="phoneNumber" className="ms-2">
                    Phone Number
                  </label>
                </div>
              </div>
              <button className="alumni-submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* Important Events */}
        {userRole === "alumni" ||
        userRole === "active" ||
        userRole === "admin" ? (
          <div className="important-events">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Important Dates</h2>
                {important.length === 0 && (
                  <p className="card-text">
                    No Events Published...
                    <br />
                    Check Back Later!
                  </p>
                )}
                {important.length > 0 && (
                  <div className="card-text">
                    {important.map((event) => (
                      <div key={event.id} className="all-event-wrapper card">
                        <div
                          className="event-clickable"
                          onClick={() => {
                            setShowEventInfo(true);
                            setSelectedEvent(event);
                          }}
                        >
                          <h4>{event.title}</h4>
                          <p>Click for more info</p>
                        </div>
                        {userRole === "admin" && (
                          <Fragment>
                            <button
                              className="trash-can-wrapper"
                              onClick={() => {
                                handleDelete(
                                  "alumni",
                                  event.id,
                                  event.imagePath,
                                );
                              }}
                            >
                              <FaTrash className="trash-can" />
                            </button>
                            <button
                              className="edit-btn-wrapper"
                              onClick={() =>
                                handleNavigate(navigate, "Onlybros", "alumni")
                              }
                            >
                              Edit
                            </button>
                          </Fragment>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="important-events">
            <div className="card">
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
        <div className="tau-events">
          <h2>Tau Events</h2>
          {events.length === 0 && (
            <p className="card-text">
              No Events Published...
              <br />
              Check Back Later!
            </p>
          )}
          {events.length > 0 && (
            <div className="card-text">
              {events.map((event) => (
                <div key={event.id} className="all-event-wrapper card">
                  <div
                    className="event-clickable"
                    onClick={() => {
                      setShowEventInfo(true);
                      setSelectedEvent(event);
                    }}
                  >
                    <h4>{event.title}</h4>
                    <p>Click for more info</p>
                  </div>
                  {userRole === "admin" && (
                    <Fragment>
                      <button
                        className="trash-can-wrapper"
                        onClick={() => {
                          handleDelete("alumni", event.id, event.imagePath);
                        }}
                      >
                        <FaTrash className="trash-can" />
                      </button>
                      <button
                        className="edit-btn-wrapper"
                        onClick={() =>
                          handleNavigate(navigate, "Onlybros", "alumni")
                        }
                      >
                        Edit
                      </button>
                    </Fragment>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Brotherhood events */}
        <div className="tau-brotherhood">
          <h2>Tau Brotherhood</h2>
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
                    <h4>{event.title}</h4>
                    <p>Click for more info</p>
                  </div>
                  {userRole === "admin" && (
                    <Fragment>
                      <button
                        className="trash-can-wrapper"
                        onClick={() => {
                          handleDelete("alumni", event.id, event.imagePath);
                        }}
                      >
                        <FaTrash className="trash-can" />
                      </button>
                      <button
                        className="edit-btn-wrapper"
                        onClick={() =>
                          handleNavigate(navigate, "Onlybros", "alumni")
                        }
                      >
                        Edit
                      </button>
                    </Fragment>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Recents */}
        <div className="recent-side-bar">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Recents</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alumni;
