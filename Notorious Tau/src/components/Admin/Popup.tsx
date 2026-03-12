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
import type {
  EventItem,
  Awards,
  Event,
  Knights,
} from "../EventsFolder/eventData";
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
  const [knights, setKnights] = useState<Knights[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKnightId, setEditingKnightId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [editType, setEditType] = useState("");
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editAwards, setEditAwards] = useState<
    { title: string; year: string }[]
  >([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | undefined;

    if (collectionName !== "") {
      const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (activeHouse) {
          const knightList: Knights[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Knights, "id">),
          }));

          setKnights(knightList);
        } else {
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
                event.id.startsWith("alumni_") ||
                event.id.startsWith("gallery_"),
            );
            setEvents(descriptionEvents);
          } else {
            setEvents(eventList);
          }
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

  const handleEdit = async (document: any) => {
    if (activeHouse) {
      console.log("button clicked");
      setEditingKnightId(document.id);
      setEditName(document.name);
      setEditPosition(document.position);
      setEditAwards(document.awards || []);
    } else {
      setEditTitle(document.documentTitle);
      setEditingId(document.id);
      setEditDescription(document.description || "");
      setEditItems(document.items || []);
      setEditDate(document.date);
      if (document.date) {
        const dateObj = document.date.toDate()
          ? document.date.toDate()
          : new Date(document.date);

        const formattedDate = dateObj.toISOString().split("T")[0];
        const formattedTime = dateObj.toTimeString().slice(0, 5);

        setEditDate(formattedDate);
        setEditTime(formattedTime);
      }
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      if (!activeHouse) {
        const updateData: any = {
          eventTitle: editTitle,
          description: editDescription,
        };

        if (hasItems) {
          updateData.items = editItems;
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

        await updateDoc(doc(db, collectionName, id), updateData);
      } else {
        console.log("button clicked");
        const updateKnight: any = {
          type: editType,
          name: editName,
          position: editPosition,
        };

        if (editAwards) {
          updateKnight.awards = editAwards;
        }

        console.log(updateKnight);

        await updateDoc(doc(db, collectionName, id), updateKnight);
      }

      setEditType("");
      setEditingId("");
      setEditingKnightId("");
    } catch (error) {
      console.error("Error editing: ", error);
    }
  };

  const addAwardField = () => {
    setEditAwards([...editAwards, { title: "", year: "" }]);
  };

  const deleteAwardField = (index: number) => {
    const updateAwards = editAwards.filter((_, i) => i !== index);
    setEditAwards(updateAwards);
  };

  if (activeHouse) {
    return (
      <Fragment>
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="event-popup-container">
              <h3>Active & Executives</h3>
              {knights.map((knight) => (
                <Fragment key={knight.id}>
                  {editingKnightId === knight.id ? (
                    <div className="edit-container">
                      <label className="admin-label">
                        Choose a Exec/Active
                      </label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                      >
                        <option value="">Choose Gallery</option>
                        <option value="active">Active</option>
                        <option value="executive">Executive</option>
                      </select>
                      <label className="admin-label">Enter Name</label>
                      <input
                        className="knight-input"
                        type="text"
                        value={editName}
                        placeholder="Name"
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <label className="admin-label">Enter Position</label>
                      <input
                        className="knight-input"
                        type="text"
                        value={editPosition}
                        placeholder="Position"
                        onChange={(e) => setEditPosition(e.target.value)}
                      />
                      <label className="admin-label">Enter Awards</label>
                      {editAwards.map((award, index) => (
                        <div className="knight-row mb-3" key={index}>
                          <input
                            className="knight-input"
                            type="text"
                            placeholder="Award"
                            value={award.title}
                            onChange={(e) => {
                              const updatedAwards = [...editAwards];
                              updatedAwards[index].title = e.target.value;
                              setEditAwards(updatedAwards);
                            }}
                          />
                          <input
                            className="knight-input award-year"
                            type="number"
                            placeholder="Year"
                            value={award.year}
                            onChange={(e) => {
                              const updatedAwards = [...editAwards];
                              updatedAwards[index].year = e.target.value;
                              setEditAwards(updatedAwards);
                            }}
                          />
                          <button
                            className="admin-btn delete-btn item-delete"
                            onClick={() => deleteAwardField(index)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <button className="admin-btn" onClick={addAwardField}>
                        + Add Another Award
                      </button>
                      <div className="event-actions">
                        <button
                          className="admin-btn edit-btn"
                          onClick={() => handleSaveEdit(knight.id)}
                        >
                          Save
                        </button>
                        <button
                          className="admin-btn cancel-btn"
                          onClick={() => setEditingKnightId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-mode-container active-house">
                      <div className="knight-description">
                        <img
                          className="knight-image-display"
                          src={knight.imageURL}
                          alt="Knight"
                        />
                        <div className="knight-item-view">
                          <span>Name:</span>
                          <span>{knight.name}</span>
                        </div>
                        <div className="knight-item-view">
                          <span>Position:</span>
                          <span>{knight.position}</span>
                        </div>
                        <div className="knight-item-view">
                          <span>Knight Name:</span>
                          <span>{knight.knightName}</span>
                        </div>
                        <div className="knight-item-view">
                          <span>Line #:</span>
                          <span>{knight.lineNumber}</span>
                        </div>
                        <div className="knight-item-view">
                          <span>Line Name:</span>
                          <span>{knight.lineName}</span>
                        </div>
                        <div className="knight-item-view">
                          <span>Cross Date:</span>
                          <span>{knight.crossDate}</span>
                        </div>
                        {knight.awards &&
                          knight.awards?.map(
                            (awards: Awards, index: number) => (
                              <div className="item-row" key={index}>
                                <span>{awards.title}</span>
                                <span>{awards.year}</span>
                              </div>
                            ),
                          )}
                      </div>
                      <div className="event-actions">
                        <button
                          className="admin-btn edit-btn"
                          onClick={() => handleEdit(knight)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn delete-btn"
                          onClick={() =>
                            handleDelete(knight.id, knight.imagePath)
                          }
                        >
                          Delete Event
                        </button>
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {showCloseButton && (
              <button className="admin-btn close-btn" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </Fragment>
    );
  }

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
                <h3>Existing Events</h3>
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
                        {!event.date && (
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
                      <div className="view-mode-container">
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
