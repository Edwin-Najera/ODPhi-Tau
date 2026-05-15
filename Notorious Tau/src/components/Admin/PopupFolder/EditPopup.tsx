import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import type {
  BaseDocument,
  Knights,
  Countdown,
  Alumni,
} from "../../EventsFolder/eventData";
import {
  showMessage,
  handleArrayChange,
  formatPrice,
} from "../../../utils/handle";
import "../../global.css";
import Popup from "./Popup";

type EditPopupProps = {
  collectionName: string;
  document: BaseDocument | null;
  onClose: () => void;
  hasDate?: boolean;
  hasItems?: boolean;
  activeHouse?: boolean;
};

function EditPopup({
  collectionName,
  document,
  onClose,
  hasDate = false,
  hasItems = false,
  activeHouse = false,
}: EditPopupProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
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
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });

  useEffect(() => {
    if (!document) return;

    if (activeHouse) {
      const knightDoc = document as Knights;
      setEditType(knightDoc.type);
      setEditPosition(knightDoc.position);
      setEditAwards(knightDoc.awards);
    } else if (collectionName === "countdown") {
      const countdownDoc = document as Countdown;
      setEditTitle(countdownDoc.title ?? "");
      setEditCountdownEvents(countdownDoc.events || []);
    } else if (collectionName === "alumni") {
      const alumniDoc = document as Alumni;
      setEditTitle(alumniDoc.title || "");
      setEditDate(alumniDoc.date || "");
      setEditLocation(alumniDoc.location || "");
    } else {
      const eventDoc = document as BaseDocument;
      setEditTitle(eventDoc.title || "");
      setEditDescription(eventDoc.description || "");
      setEditItems(eventDoc.items || []);
      if (eventDoc.date) {
        setEditDate(eventDoc.date || "");
      }
    }
  }, [document]);

  const handleSaveEdit = async (id: string) => {
    try {
      if (activeHouse) {
        const updateKnight: Partial<Knights> = {
          type: editType,
          position: editPosition,
          awards: editAwards,
        };

        await updateDoc(doc(db, "house", id), updateKnight);
      } else if (collectionName === "countdown") {
        const updateData: any = {
          title: editTitle,
          events: editCountdownEvents,
        };

        await updateDoc(doc(db, "countdown", id), updateData);
      } else {
        const updateData: Partial<BaseDocument> = {
          title: editTitle,
          description: editDescription,
        };

        if (hasItems) {
          updateData.items = editItems;
        }

        if (collectionName === "alumni") {
          (updateData as Partial<Alumni>).location = editLocation;
          updateData.date = editDate;
        }

        if (hasDate && collectionName !== "alumni") {
          if (!editDate) {
            showMessage("Date and Time Required", "save", setPopup);
            return;
          }

          updateData.date = editDate;
        }

        await updateDoc(doc(db, collectionName, id), updateData);
      }
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
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2>Edit {collectionName === "countdown" ? "Countdown" : "Event"}</h2>

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
          <>
            {collectionName === "house" ? (
              <div className="edit-container">
                <h4>{(document as Knights).name}</h4>
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
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "title",
                            e.target.value,
                            editAwards,
                            setEditAwards,
                          )
                        }
                        placeholder={award.title || "Award Title"}
                      />
                      <input
                        className="knight-input award-year"
                        type="number"
                        value={award.year}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "year",
                            e.target.value,
                            editAwards,
                            setEditAwards,
                          )
                        }
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
                  <button className="admin-btn add-btn" onClick={addAwardField}>
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
                  placeholder={document?.title}
                />
                {document?.description && (
                  <>
                    <label htmlFor="documentDescription">Description: </label>
                    <textarea
                      id="documentDescription"
                      className="description-input"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={document?.description}
                    />
                  </>
                )}
                {hasDate && (
                  <>
                    <label htmlFor="documentDate">Date: </label>
                    <input
                      id="documentDate"
                      type="datetime-local"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </>
                )}
                {editLocation && (
                  <>
                    <label htmlFor="eventLocation">Location: </label>
                    <input
                      id="eventLocation"
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                    />
                  </>
                )}
                {hasItems && (
                  <>
                    <label>Items: </label>
                    <div className="item-input">
                      {document?.items?.map((item, index) => (
                        <div key={index} className="item-row">
                          <input
                            className="input-event"
                            type="text"
                            value={editItems[index]?.name || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                "name",
                                e.target.value,
                                editItems,
                                setEditItems,
                              )
                            }
                            placeholder={item.name}
                          />
                          <div className="price-wrapper">
                            <span>$</span>
                            <input
                              className="input-event price-input"
                              type="text"
                              value={editItems[index]?.price || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "price",
                                  formatPrice(e.target.value) as string,
                                  editItems,
                                  setEditItems,
                                )
                              }
                              placeholder={item.price}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

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
        {popup.show && (
          <Popup
            message={popup.message}
            onClose={() => setPopup({ show: false, message: "", type: null })}
            duration={1000}
          />
        )}
      </div>
    </div>
  );
}

export default EditPopup;
