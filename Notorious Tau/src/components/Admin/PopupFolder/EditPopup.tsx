import { useState, useEffect, Fragment } from "react";
import { db, storage } from "../../../firebase";
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
  BaseDocument,
  EventItem,
  Awards,
  Event,
  Knights,
  Countdown,
} from "../../EventsFolder/eventData";
import "../../global.css";
import CountdownDisplay from "../CountdownFolder/CountdownDisplay";

type EditPopupProps = {
  collectionName: string;
  document: BaseDocument | null;
  onClose: () => void;
  showGallery?: boolean;
  hasDate?: boolean;
  hasItems?: boolean;
  activeHouse?: boolean;
};

function EditPopup({
  collectionName,
  document,
  onClose,
  showGallery = false,
  hasDate = false,
  hasItems = false,
  activeHouse = false,
}: EditPopupProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [editType, setEditType] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editAwards, setEditAwards] = useState<
    { title: string; year: string }[]
  >([]);
  const [editCountdownEvents, setEditCountdownEvents] = useState<
    {
      title: string;
      date: string;
      location: string;
      startTime: string;
      endTime: string;
    }[]
  >([]);

  useEffect(() => {
    if (!document) return;

    if (activeHouse) {
      console.log("button clicked");
      const knightDoc = document as Knights;
      setEditType(knightDoc.type);
      setEditPosition(knightDoc.position);
      setEditAwards(knightDoc.awards);
    } else if (collectionName === "countdown") {
      const countdownDoc = document as Countdown;
      setEditTitle(countdownDoc.title ?? "");
      setEditCountdownEvents(countdownDoc.events || []);
    } else {
      const eventDoc = document as Event;
      setEditTitle(eventDoc.eventTitle || "");
      setEditDescription(eventDoc.description || "");
      setEditItems(eventDoc.items || []);
      if (eventDoc.date) {
        const dateObj =
          typeof eventDoc.date.toDate === "function"
            ? eventDoc.date.toDate()
            : new Date(eventDoc.date);

        const formattedDate = dateObj.toISOString().split("T")[0];
        const formattedTime = dateObj.toTimeString().slice(0, 5);

        setEditDate(formattedDate);
        setEditTime(formattedTime);
      }
    }
  }, [document]);

  const handleSaveEdit = async (id: string) => {
    try {
      if (!activeHouse && collectionName !== "countdown") {
        const updateData: any = {
          title: editTitle,
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
      } else if (collectionName === "countdown") {
        const updateData: any = {
          title: editTitle,
          events: editCountdownEvents,
        };

        await updateDoc(doc(db, "countdown", id), updateData);
      } else {
        console.log("button clicked");
        const updateKnight: any = {
          type: editType,
          name: editTitle,
          position: editPosition,
        };

        if (editAwards) {
          updateKnight.awards = editAwards;
        }

        console.log(updateKnight);

        await updateDoc(doc(db, collectionName, id), updateKnight);
      }

      setEditType("");
    } catch (error) {
      console.error("Error editing: ", error);
    }
  };

  const addAwardField = () => {
    setEditAwards([...editAwards, { title: "", year: "" }]);
  };

  const deleteField = (index: number) => {
    if (collectionName === "countdown") {
      const updateEvents = editCountdownEvents.filter((_, i) => i !== index);
      setEditCountdownEvents(updateEvents);
    } else {
      const updateAwards = editAwards.filter((_, i) => i !== index);
      setEditAwards(updateAwards);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Edit {collectionName === "countdown" ? "Countdown" : "Event"}</h2>
        <Fragment>
          {collectionName === "countdown" ? (
            <div className="edit-container countdown">
              <label htmlFor="documentTitle">Title: </label>
              <input
                id="documentTitle"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={document?.title}
              />
            </div>
          ) : (
            <Fragment>
              {collectionName === "house" ? (
                <div className="edit-container">
                  <h4>{document?.name}</h4>
                  <label className="admin-label">Choose a Exec/Active</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose Gallery
                    </option>
                    <option value="active">Active</option>
                    <option value="executive">Executive</option>
                  </select>
                  <label htmlFor="knightPosition">Position: </label>
                  <input
                    id="knightPosition"
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    placeholder={(document as Knights).position}
                  />
                  <div className="awards-input">
                    <label htmlFor="awards" className="admin-label">
                      Enter awards
                    </label>
                    {editAwards.map((award, index) => (
                      <div id="awards" className="knight-row" key={index}>
                        <input
                          className="knight-input"
                          type="text"
                          value={award.title}
                          onChange={(e) => {
                            const updatedAwards = [...editAwards];
                            ((updatedAwards[index] = {
                              ...updatedAwards[index],
                              title: e.target.value,
                            }),
                              setEditAwards(updatedAwards));
                          }}
                          placeholder={award.title || "Award Title"}
                        />
                        <input
                          className="knight-input award-year"
                          type="number"
                          value={award.year}
                          onChange={(e) => {
                            const updatedAwards = [...editAwards];
                            ((updatedAwards[index] = {
                              ...updatedAwards[index],
                              year: e.target.value,
                            }),
                              setEditAwards(updatedAwards));
                          }}
                          placeholder={award.year || "Year"}
                        />
                        <button
                          className="admin-btn delete-btn item-delete"
                          onClick={() => deleteField(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      className="admin-btn add-btn"
                      onClick={addAwardField}
                    >
                      Add Award
                    </button>
                  </div>
                </div>
              ) : (
                <div className="edit-container">
                  <label htmlFor="documentTitle">Title: </label>
                  <input
                    id="documentTitle"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={document?.eventTitle}
                  />
                  <label htmlFor="documentDescription">Description: </label>
                  {document?.description && (
                    <input
                      id="documentDescription"
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={document?.description}
                    />
                  )}
                  {hasDate && (
                    <Fragment>
                      <label htmlFor="documentDate">Date: </label>
                      <input
                        id="documentDate"
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                      <label htmlFor="documentTime">Time: </label>
                      <input
                        id="documentTime"
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                      />
                    </Fragment>
                  )}
                  {hasItems && (
                    <Fragment>
                      <label>Items: </label>
                      <div className="item-input">
                        {document?.items?.map((item, index) => (
                          <div key={index} className="item-row">
                            <input
                              className="input-event"
                              type="text"
                              value={editItems[index]?.name || ""}
                              onChange={(e) => {
                                const updatedItems = [...editItems];
                                ((updatedItems[index] = {
                                  ...updatedItems[index],
                                  name: e.target.value,
                                }),
                                  setEditItems(updatedItems));
                              }}
                              placeholder={item.name}
                            />
                            <div className="price-wrapper">
                              <span>$</span>
                              <input
                                className="input-event price-input"
                                type="text"
                                value={editItems[index]?.price || ""}
                                onChange={(e) => {
                                  const updatedItems = [...editItems];
                                  ((updatedItems[index] = {
                                    ...updatedItems[index],
                                    price: e.target.value,
                                  }),
                                    setEditItems(updatedItems));
                                }}
                                placeholder={item.price}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Fragment>
                  )}
                </div>
              )}
            </Fragment>
          )}
        </Fragment>

        <button
          className="admin-btn save-btn"
          onClick={() => {
            handleSaveEdit(document?.id || "");
            onClose();
          }}
        >
          Save
        </button>
        <button className="admin-btn cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditPopup;
