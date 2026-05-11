import { useState, Fragment } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {
  handleArrayChange,
  handleAddArrayItem,
  handleDeleteArrayItem,
  uploadImage,
  showMessage,
} from "../../../utils/handle";
import "../../global.css";
import type {
  BaseDocument,
  EventItem,
  Knights,
  Awards,
  Alumni,
} from "../../EventsFolder/eventData";
import Popup from "../PopupFolder/Popup";

type Props = {
  collectionName: string;
  hasItems?: boolean;
  hasDate?: boolean;
  onlyPhotos?: boolean;
  activeHouse?: boolean;
};

function AdminPanel({
  collectionName,
  hasItems = false,
  hasDate = false,
  onlyPhotos = false,
  activeHouse = false,
}: Props) {
  const [eventForm, setEventForm] = useState<Partial<BaseDocument>>({
    title: "", //For Title of the Event *REQUIRED*
    description: "",
    date: "",
    items: [],
  });

  const [knightForm, setKnightForm] = useState<Partial<Knights>>({
    name: "",
    position: "",
    knightName: "",
    lineNumber: "",
    lineName: "",
    crossDate: "",
    awards: [],
    type: "",
    graduating: false,
  });

  const [alumniForm, setAlumniForm] = useState<Partial<Alumni>>({
    title: "",
    important: false,
    location: "",
  });
  const [items, setItems] = useState<EventItem[]>([{ name: "", price: "" }]); //For items and prices of items
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const [awards, setAwards] = useState<Awards[]>([{ title: "", year: "" }]);
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const [loading, setLoading] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    let message = "";
    if (!activeHouse) {
      if (!eventForm.title) {
        message = onlyPhotos ? "Please Choose a Gallery" : "Title Required";

        showMessage(message, "save", setPopup);
        return;
      } else if (
        !imageFile &&
        (!hasDate || onlyPhotos) &&
        collectionName !== "campus" &&
        collectionName !== "brotherhood"
      ) {
        message = "Image File required";
        showMessage(message, "save", setPopup);
        return;
      } else if (hasDate && eventForm.date === "") {
        message = "Event date Required";
        showMessage(message, "save", setPopup);
        return;
      }
    } else if (!knightForm.type) {
      message = "Please Choose a Gallery";

      showMessage(message, "save", setPopup);
      return;
    } else if (
      !imageFile &&
      (!hasDate || onlyPhotos) &&
      collectionName !== "campus" &&
      collectionName !== "brotherhood"
    ) {
      message = "Image File required";
      showMessage(message, "save", setPopup);
      return;
    }

    let imagePath = "";
    let downloadURL = "";

    if (imageFile) {
      const result = await uploadImage(
        imageFile,
        onlyPhotos ? "gallery" : "events",
      );
      imagePath = result.imagePath;
      downloadURL = result.downloadURL;
    }

    try {
      const newEvent: Partial<BaseDocument> = {
        ...eventForm,
        createdAt: new Date(),
      };

      const newKnight: Partial<Knights> = {
        ...knightForm,
        createdAt: new Date(),
        awards,
      };

      const alumniEvent: Partial<Alumni> = {
        ...alumniForm,
        createdAt: new Date(),
      };

      if (awards) {
        newKnight.awards = awards;
      }

      if (imageFile) {
        if (activeHouse) {
          newKnight.imageURL = downloadURL;
          newKnight.imagePath = imagePath;
        } else {
          newEvent.imageURL = downloadURL;
          newEvent.imagePath = imagePath;
        }
      }

      if (hasItems) {
        newEvent.items = items;
      }
      if (hasDate) {
        if (!eventForm.date) {
          message = "Date Required";
          showMessage(message, "save", setPopup);
          return;
        }

        newEvent.date = new Date(eventForm.date);
      }

      if (onlyPhotos) {
        const collectionPhotos = activeHouse ? "house" : "photos";
        const collectionRef = collection(db, collectionPhotos);
        const identifier = activeHouse ? knightForm.type : eventForm.title;

        const autoId = doc(collectionRef).id;
        const customId = `${identifier}_${autoId}`;

        const newDocument = activeHouse ? newKnight : newEvent;
        console.log(newDocument);

        await setDoc(doc(db, collectionName, customId), newDocument);
      } else if (collectionName === "alumni") {
        await addDoc(collection(db, "alumni"), alumniEvent);
      } else {
        await addDoc(collection(db, collectionName), newEvent);
      }

      message = "Event added Successfully";
      showMessage(message, "save", setPopup);

      setEventForm({
        title: "",
        description: "",
        date: "",
        items: [],
      });
      setKnightForm({
        name: "",
        position: "",
        knightName: "",
        lineNumber: "",
        lineName: "",
        crossDate: "",
        awards: [],
        type: "",
        graduating: false,
      });
      setAlumniForm({
        title: "",
        important: false,
      });
      setItems([{ name: "", price: "" }]);
      setImageFile(null);
    } catch (error) {
      message = "Error adding event";
      showMessage(message, "save", setPopup);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (field: keyof BaseDocument, value: string) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleKnightChange = (field: keyof Knights, value: string) => {
    setKnightForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAlumniChange = (field: keyof Alumni, value: string | boolean) => {
    setAlumniForm((prev) => ({ ...prev, [field]: value }));
  };

  if (activeHouse) {
    return (
      <div className="row w-100 d-flex justify-content-around">
        <div className="admin-container">
          <label className="admin-label">Choose a Exec/Active</label>
          <select
            value={knightForm.type ?? ""}
            onChange={(e) => handleKnightChange("type", e.target.value)}
          >
            <option value="" disabled>
              Choose Gallery
            </option>
            <option value="active">Active</option>
            <option value="executive">Executive</option>
          </select>
          <label htmlFor="name" className="admin-label">
            Enter Name
          </label>
          <input
            className="knight-input"
            id="name"
            type="text"
            placeholder="Name"
            onChange={(e) => handleKnightChange("name", e.target.value)}
          />
          <label htmlFor="position" className="admin-label">
            Enter Position
          </label>
          <input
            className="knight-input"
            id="position"
            type="text"
            placeholder="Position"
            onChange={(e) => handleKnightChange("position", e.target.value)}
          />
          <label htmlFor="knight-name" className="admin-label">
            Enter Knight Name
          </label>
          <input
            className="knight-input"
            id="knight-name"
            type="text"
            placeholder="Knight Name"
            onChange={(e) => handleKnightChange("knightName", e.target.value)}
          />
          <label htmlFor="line-num" className="admin-label">
            Enter Line Number
          </label>
          <input
            className="knight-input"
            id="line-num"
            type="number"
            placeholder="Line Number"
            onChange={(e) => handleKnightChange("lineNumber", e.target.value)}
          />
          <label htmlFor="line-name" className="admin-label">
            Enter Line Name
          </label>
          <input
            className="knight-input"
            id="line-name"
            type="text"
            placeholder="Line Name"
            onChange={(e) => handleKnightChange("lineName", e.target.value)}
          />
          <label htmlFor="cross-date" className="admin-label">
            Enter Cross Date
          </label>
          <input
            className="knight-input"
            id="cross-date"
            type="text"
            placeholder="Cross Date Semester-Year"
            onChange={(e) => handleKnightChange("crossDate", e.target.value)}
          />
          <br />
          <label htmlFor="event-image" className="admin-label">
            Enter Knight Image
          </label>
          <input
            type="file"
            id="event-image"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
          <Fragment>
            <div className="awards-input">
              <label htmlFor="awards" className="admin-label">
                Enter awards
              </label>
              {awards.map((award, index) => (
                <div id="awards" className="knight-row" key={index}>
                  <input
                    className="knight-input"
                    type="text"
                    placeholder="Award"
                    value={award.title}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "title",
                        e.target.value,
                        awards,
                        setAwards,
                      )
                    }
                  />
                  <input
                    className="knight-input award-year"
                    type="number"
                    placeholder="Year"
                    value={award.year}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "year",
                        e.target.value,
                        awards,
                        setAwards,
                      )
                    }
                  />
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() =>
                      handleDeleteArrayItem(index, awards, setAwards)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              className="admin-btn"
              onClick={() =>
                handleAddArrayItem({ title: "", year: "" }, awards, setAwards)
              }
            >
              + Add Another Award
            </button>
          </Fragment>
          <br />
          <br />
          <button className="admin-btn" onClick={() => handleSubmit()}>
            {loading ? "Saving..." : "Save Event"}
          </button>
          {popup.show && popup.type === "active" && (
            <Popup
              message=""
              onClose={() =>
                setPopup({ show: false, type: "active", message: "" })
              }
              collectionName={collectionName}
              showCloseButton={true}
              activeHouse={true}
            />
          )}
          {popup.show && (
            <Popup
              message={popup.message}
              collectionName={""}
              onClose={() =>
                setPopup({ show: false, type: "save", message: "" })
              }
              autoClose={true}
              duration={1000}
              showCloseButton={false}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    // The following is only whenever inputting events
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        {onlyPhotos && (
          // Specifically for inputting only photos, only a title in which the title is the database, and photo are needed
          <Fragment>
            <label className="admin-label">Choose a Gallery</label>
            <select
              value={eventForm.title}
              onChange={(e) => handleEventChange("title", e.target.value)}
            >
              <option value="" disabled>
                Choose Gallery
              </option>
              {!activeHouse && (
                <Fragment>
                  <option value="alumni">Alumni Gallery</option>
                  <option value="gallery">Gallery</option>
                </Fragment>
              )}
            </select>
          </Fragment>
        )}
        {!onlyPhotos && (
          // If its not for a gallery, the title can be anything
          <Fragment>
            <label className="admin-label">Enter Title</label>
            <input
              type="text"
              placeholder="Event Title"
              value={
                collectionName === "alumni" ? alumniForm.title : eventForm.title
              }
              onChange={(e) => {
                handleEventChange("title", e.target.value); // This is for events
                handleAlumniChange("title", e.target.value); // This is for alumni events
              }}
            />
          </Fragment>
        )}
        {collectionName !== "alumni" &&
          (!onlyPhotos || eventForm.title === "gallery") && (
            // When an event does not have a date or isn't `onlyPhotos=true` the following will be executed
            <Fragment>
              <br />
              <label className="admin-label">Enter Description</label>
              <textarea
                className="description-input"
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) =>
                  handleEventChange("description", e.target.value)
                }
              />
            </Fragment>
          )}
        {hasDate && (
          //If there is a date, then we will ask for the date of the event
          <Fragment>
            <br />
            <label className="admin-label">Enter Date</label>
            <input
              type="datetime-local"
              value={
                collectionName === "alumni" ? alumniForm.date : eventForm.date
              }
              onChange={(e) => {
                handleEventChange("date", e.target.value);
                handleAlumniChange("date", e.target.value);
              }}
            />
          </Fragment>
        )}
        {collectionName === "alumni" && (
          <Fragment>
            <br />
            <label htmlFor="eventLocation" className="admin-label">
              Location
            </label>
            <input
              type="text"
              placeholder="123 ABC Ave."
              value={alumniForm.location}
              onChange={(e) => handleAlumniChange("location", e.target.value)}
            />
            <form className="mt-3">
              <div className="row">
                <label
                  className="admin-label ms-3 col"
                  htmlFor="importantCheck"
                >
                  Important?
                </label>
                <input
                  type="checkbox"
                  className="admin-checkbox col"
                  id="importantCheck"
                  checked={alumniForm.important}
                  onChange={(e) => {
                    handleAlumniChange("important", e.target.checked);
                    setDisplayEvents(e.target.checked);
                  }}
                />
              </div>
              {displayEvents && (
                <div className="row ms-3">
                  <div className="col">Important is for following events</div>
                  <ul>
                    <li>Initiation</li>
                    <li>Mid-Review</li>
                    <li>Activation</li>
                    <li>PM Social</li>
                    <li>PM Fundraisers</li>
                    <li>Probate Dates</li>
                  </ul>
                </div>
              )}
            </form>
          </Fragment>
        )}
        {!hasDate && collectionName !== "brotherhood" && (
          // If the event requires an image, there will be an input for images
          <Fragment>
            <br />
            <label className="admin-label">Enter Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt=""
                className="preview-image"
              />
            )}
          </Fragment>
        )}
        {hasItems && (
          // If the event has items to sell there will be an input for it
          <Fragment>
            <h3>Price Options</h3>
            <div className="item-input">
              <label className="admin-label">Enter Items and Prices</label>
              {items.map((item, index) => (
                <div className="item-row" key={index}>
                  <input
                    className="input-event"
                    type="text"
                    placeholder="Item Title"
                    value={item.name}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "name",
                        e.target.value,
                        items,
                        setItems,
                      )
                    }
                  />
                  <div className="price-wrapper">
                    <span>$</span>
                    <input
                      className="input-event price-input"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price 0.00"
                      value={item.price}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "price",
                          e.target.value,
                          items,
                          setItems,
                        )
                      }
                    />
                  </div>
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() =>
                      handleDeleteArrayItem(index, items, setItems)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              className="admin-btn"
              onClick={() =>
                handleAddArrayItem({ name: "", price: "" }, items, setItems)
              }
            >
              + Add Another Price
            </button>
          </Fragment>
        )}
        <br />
        {!hasDate && <br />}
        <button className="admin-btn" onClick={() => handleSubmit()}>
          Save Event
        </button>
        {popup.show && (
          <Popup
            message={popup.message}
            collectionName={""}
            onClose={() => setPopup({ show: false, type: "save", message: "" })}
            autoClose={true}
            duration={1000}
            showCloseButton={false}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
