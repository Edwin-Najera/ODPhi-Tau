import { useState, useEffect, Fragment } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import type { EventItem, Event, KnightPerson } from "../EventsFolder/eventData";
import "../global.css";

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
  showCloseButton = false,
  duration = 1000,
  showGallery = false,
  hasDate = false,
  hasItems = false,
  activeHouse = false,
}: PopupProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [editKnight, setEditKnight] = useState<KnightPerson | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | undefined;

    if (collectionName !== "") {
      const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const eventList: Event[] = snapshot.docs.map((doc) => {
          const rawData = doc.data();

          return {
            id: doc.id,
            ...rawData,
            date: rawData.date?.toDate ? rawData.date.toDate() : rawData.date,
          } as Event;
        });

        //If the active house popup is shown then only those that have the description of each knight should be show
        if (showGallery) {
          const descriptionEvents = eventList.filter(
            (event) =>
              event.id.startsWith("alumni_") || event.id.startsWith("gallery_"),
          );
          setEvents(descriptionEvents);
        } else {
          setEvents(eventList);
        }
      });
    }

    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose, collectionName, showGallery]);

  const handleDelete = async (eventId: string, imagePath?: string) => {
    //Deleting image from database
    if (!hasDate && collectionName !== "campus") {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    }

    //Deleting Firestore document
    await deleteDoc(doc(db, collectionName, eventId));
  };

  const handleEdit = async (event: any) => {
    setEditingId(event.id);
    setEditTitle(event.eventTitle);
    setEditDescription(event.description || "");
    setEditItems(event.items || []);
    setEditDate(event.date);
    setEditKnight(event.knights || "");

    if (event.date) {
      const dateObj = event.date.toDate()
        ? event.date.toDate()
        : new Date(event.date);

      const formattedDate = dateObj.toISOString().split("T")[0];
      const formattedTime = dateObj.toTimeString().slice(0, 5);

      setEditDate(formattedDate);
      setEditTime(formattedTime);
    }
  };

  const handleSaveEdit = async (eventId: string) => {
    try {
      const updateData: any = {
        eventTitle: editTitle,
      };

      if (hasItems) {
        updateData.items = editItems;
        updateData.description = editDescription;
      }
      if (hasDate) {
        if (!editDate || !editTime) {
          alert("Date and Time Required");
          return;
        }

        const combinedDateTime = new Date(`${editDate}T${editTime}`);

        if (isNaN(combinedDateTime.getTime())) {
          alert("Invalid Date/Time");
          return;
        }

        updateData.date = combinedDateTime;
      }

      if (activeHouse) {
        updateData.knights = editKnight;
      }

      await updateDoc(doc(db, collectionName, eventId), updateData);

      setEditingId(null);
    } catch (error) {
      console.error("Error editing: ", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        {showGallery && (
          // This is when displaying the gallery
          // The gallery is only for photos in the alumni recap section or gallery section
          <div className="gallery-container">
            {events.map((event) => (
              <Fragment key={event.id}>
                <div className="gallery-image-container">
                  <div>Gallery: {event.eventTitle}</div>
                  <img
                    className="gallery-image"
                    src={event.imageURL}
                    alt="Gallery Photo"
                  />
                  <button
                    className="admin-btn delete-btn mt-2"
                    onClick={() => handleDelete(event.id, event.imagePath)}
                  >
                    Delete Photo
                  </button>
                </div>
              </Fragment>
            ))}
          </div>
        )}
        {!showGallery && message === "" && (
          // If not displaying gallery display the events depending on which admin panel is being used
          // If a gallery is displaying no need to edit
          <Fragment>
            {events && (
              <div className="event-popup-container">
                {/* If displaying active house display different title */}
                <h3>{activeHouse ? "Active and Execs" : "Existing Events"}</h3>
                {events.map((event) => (
                  <div key={event.id}>
                    {editingId === event.id ? (
                      <div className="edit-container">
                        {!showGallery && !activeHouse && (
                          // For Editing title
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        )}
                        {!event.date && !activeHouse && (
                          // For Editing description if there is one
                          // Description for a knight is different than a regular description
                          <Fragment>
                            <br />
                            <textarea
                              className="description-input"
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                            <br />
                          </Fragment>
                        )}
                        {event.date && (
                          // For editing date if there is one
                          <Fragment>
                            <br />
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                            />
                            <br />
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                            />
                          </Fragment>
                        )}
                        {event.items &&
                          // For editing items if there are any
                          editItems.map((item, index) => (
                            <div className="item-row" key={index}>
                              <input
                                className="input-event"
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const updatedItems = [...editItems];
                                  updatedItems[index].name = e.target.value;
                                  setEditItems(updatedItems);
                                }}
                              />
                              <div className="price-wrapper">
                                <span>$</span>
                                <input
                                  className="input-event price-input"
                                  type="text"
                                  value={item.price}
                                  onChange={(e) => {
                                    const updatedItems = [...editItems];
                                    updatedItems[index].price = e.target.value;
                                    setEditItems(updatedItems);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        {activeHouse && (
                          // This popup is dedicated for the active house which includes
                          // Positions
                          // Knight Name
                          // Line Numbers
                          // Line Names
                          <Fragment>
                            <label className="admin-label">Enter Name</label>
                            <input
                              className="knight-input"
                              type="text"
                              value={editKnight?.name || ""}
                              placeholder="Name"
                              onChange={(e) =>
                                setEditKnight((prev) =>
                                  prev
                                    ? { ...prev, name: e.target.value }
                                    : null,
                                )
                              }
                            />
                            <label className="admin-label">
                              Enter Position
                            </label>
                            <input
                              className="knight-input"
                              type="text"
                              value={editKnight?.position || ""}
                              placeholder="Position"
                              onChange={(e) =>
                                setEditKnight((prev) =>
                                  prev
                                    ? { ...prev, position: e.target.value }
                                    : null,
                                )
                              }
                            />
                            <label className="admin-label">
                              Enter Knight Name
                            </label>
                            <input
                              className="knight-input"
                              type="text"
                              value={editKnight?.knightName || ""}
                              placeholder="Knight Name"
                              onChange={(e) =>
                                setEditKnight((prev) =>
                                  prev
                                    ? { ...prev, knightName: e.target.value }
                                    : null,
                                )
                              }
                            />
                            <label className="admin-label">
                              Enter Line Number
                            </label>
                            <input
                              className="knight-input"
                              type="number"
                              value={editKnight?.lineNumber || ""}
                              placeholder="Line Number"
                              onChange={(e) =>
                                setEditKnight((prev) =>
                                  prev
                                    ? { ...prev, lineNumber: e.target.value }
                                    : null,
                                )
                              }
                            />
                            <label className="admin-label">
                              Enter Line Name
                            </label>
                            <input
                              className="knight-input"
                              type="text"
                              value={editKnight?.lineName || ""}
                              placeholder="Line Name"
                              onChange={(e) =>
                                setEditKnight((prev) =>
                                  prev
                                    ? { ...prev, lineName: e.target.value }
                                    : null,
                                )
                              }
                            />
                          </Fragment>
                        )}
                        <div className="event-actions">
                          <button
                            className="admin-btn edit-btn"
                            onClick={() => handleSaveEdit(event.id)}
                          >
                            Save
                          </button>
                          <button
                            className="admin-btn cancel-btn"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // The following is whenever the event is in display mode, no editing is being made
                      <div
                        className={
                          activeHouse
                            ? "view-mode-container active-house"
                            : "view-mode-container"
                        }
                      >
                        <h4>{event.eventTitle}</h4>
                        {/* Display image of the knight instead of description */}
                        {activeHouse ? (
                          <img
                            className="knight-image-display"
                            src={event.imageURL}
                            alt="knight"
                          />
                        ) : (
                          <p>{event.description}</p>
                        )}
                        {/* Specifically for event dates */}
                        {event.date && (
                          <p className="date-view-container">
                            <strong>Date</strong>
                            <br />
                            {new Date(event.date).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                        {/* When an event has items display them  */}
                        {event.items &&
                          event.items?.map((item: EventItem, index: number) => (
                            <div className="item-row" key={index}>
                              <span>{item.name}</span>
                              <span>{item.price}</span>
                            </div>
                          ))}
                        {activeHouse && (
                          // This popup is dedicated for the active house which includes
                          // Positions
                          // Knight Name
                          // Line Numbers
                          // Line Names
                          <Fragment>
                            <div className="knight-description">
                              <div className="knight-item-view">
                                <span>Name:</span>
                                <span> {event.knights?.name}</span>
                              </div>
                              <div className="knight-item-view">
                                <span>Position:</span>
                                <span> {event.knights?.position}</span>
                              </div>
                              <div className="knight-item-view">
                                <span>Knight Name:</span>
                                <span> {event.knights?.knightName}</span>
                              </div>
                              <div className="knight-item-view">
                                <span>Line #:</span>
                                <span>{event.knights?.lineNumber}</span>
                              </div>
                              <div className="knight-item-view">
                                <span>Line Name:</span>
                                <span>{event.knights?.lineName}</span>
                              </div>
                            </div>
                          </Fragment>
                        )}
                        <div className="event-actions">
                          <button
                            className="admin-btn edit-btn"
                            onClick={() => handleEdit(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn delete-btn"
                            onClick={() =>
                              handleDelete(event.id, event.imagePath)
                            }
                          >
                            Delete Event
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        )}
        {showCloseButton && (
          <button className="admin-btn close-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export default Popup;
