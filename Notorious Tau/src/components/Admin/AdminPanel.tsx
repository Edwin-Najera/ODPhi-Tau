import { useState, Fragment } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  handleArrayChange,
  handleAddArrayItem,
  handleDeleteArrayItem,
} from "../../utils/handle";
import "../global.css";
import Popup from "./PopupFolder/Popup";

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
  const [eventTitle, setEventTitle] = useState(""); //For Title of the Event *REQUIRED*
  const [items, setItems] = useState([{ name: "", price: "" }]); //For items and prices of items
  const [description, setDescription] = useState(""); //For description of the event
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [knightName, setKnightName] = useState("");
  const [lineNumber, setLineNumber] = useState("");
  const [lineName, setLineName] = useState("");
  const [crossDate, setCrossDate] = useState("");
  const [awards, setAwards] = useState([{ award: "", year: "" }]);
  const [type, setType] = useState("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [showActivePopup, setShowActivePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    let message = "";
    if (!activeHouse) {
      if (!eventTitle) {
        message = onlyPhotos
          ? "Please Choose a Gallery"
          : "Event Title Required";

        setPopupMessage(message);
        setShowSavePopup(true);
        return;
      } else if (
        !imageFile &&
        (!hasDate || onlyPhotos) &&
        collectionName !== "campus"
      ) {
        message = "Image File required";
        setPopupMessage(message);
        setShowSavePopup(true);
        return;
      } else if (hasDate && eventDate === "") {
        message = "Event date Required";
        setPopupMessage(message);
        setShowSavePopup(true);
        return;
      }
    } else if (!type) {
      message = "Please Choose a Gallery";

      setPopupMessage(message);
      setShowSavePopup(true);
      return;
    } else if (
      !imageFile &&
      (!hasDate || onlyPhotos) &&
      collectionName !== "campus"
    ) {
      message = "Image File required";
      setPopupMessage(message);
      setShowSavePopup(true);
      return;
    }

    let imagePath = "";
    let downloadURL = "";

    if (imageFile) {
      imagePath = onlyPhotos
        ? `gallery/${Date.now()}-${imageFile?.name}`
        : `events/${Date.now()}-${imageFile?.name}`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, imageFile);

      downloadURL = await getDownloadURL(imageRef);
    }

    try {
      const newEvent: any = {
        eventTitle,
        description,
        createdAt: new Date(),
      };

      const newKnight: any = {
        name: name,
        position: position,
        knightName: knightName,
        lineNumber: lineNumber,
        lineName: lineName,
        crossDate: crossDate,
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
        if (!eventDate || !eventTime) {
          message = "Date and Time Required";
          setPopupMessage(message);
          setShowSavePopup(true);
          return;
        }

        const combinedDateTime = new Date(`${eventDate}T${eventTime}`);

        if (isNaN(combinedDateTime.getTime())) {
          message = "Invalid Date/Time";
          setPopupMessage(message);
          setShowSavePopup(true);
          return;
        }

        newEvent.date = combinedDateTime;
      }

      if (onlyPhotos) {
        const collectionPhotos = activeHouse ? "house" : "photos";
        const collectionRef = collection(db, collectionPhotos);
        const identifier = activeHouse ? type : eventTitle;

        const autoId = doc(collectionRef).id;
        const customId = `${identifier}_${autoId}`;

        const newDocument = activeHouse ? newKnight : newEvent;
        console.log(newDocument);

        await setDoc(doc(db, collectionName, customId), newDocument);
      } else {
        await addDoc(collection(db, collectionName), newEvent);
      }

      message = "Event added Successfully";
      setPopupMessage(message);
      setShowSavePopup(true);
      setEventTitle("");
      setDescription("");
      setEventDate("");
      setEventTime("");
      setName("");
      setPosition("");
      setKnightName("");
      setLineNumber("");
      setLineName("");
      setCrossDate("");
      setItems([{ name: "", price: "" }]);
      setImageFile(null);
    } catch (error) {
      message = "Error adding event";
      setPopupMessage(message);
      setShowSavePopup(true);
      console.error("Error adding event: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (activeHouse) {
    return (
      <div className="row w-100 d-flex justify-content-around">
        <div className="admin-container">
          <label className="admin-label">Choose a Exec/Active</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
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
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="position" className="admin-label">
            Enter Position
          </label>
          <input
            className="knight-input"
            id="position"
            type="text"
            placeholder="Position"
            onChange={(e) => setPosition(e.target.value)}
          />
          <label htmlFor="knight-name" className="admin-label">
            Enter Knight Name
          </label>
          <input
            className="knight-input"
            id="knight-name"
            type="text"
            placeholder="Knight Name"
            onChange={(e) => setKnightName(e.target.value)}
          />
          <label htmlFor="line-num" className="admin-label">
            Enter Line Number
          </label>
          <input
            className="knight-input"
            id="line-num"
            type="number"
            placeholder="Line Number"
            onChange={(e) => setLineNumber(e.target.value)}
          />
          <label htmlFor="line-name" className="admin-label">
            Enter Line Name
          </label>
          <input
            className="knight-input"
            id="line-name"
            type="text"
            placeholder="Line Name"
            onChange={(e) => setLineName(e.target.value)}
          />
          <label htmlFor="cross-date" className="admin-label">
            Enter Cross Date
          </label>
          <input
            className="knight-input"
            id="cross-date"
            type="text"
            placeholder="Cross Date Semester-Year"
            onChange={(e) => setCrossDate(e.target.value)}
          />
          <br />
          <label htmlFor="event-image" className="admin-label">
            Enter Event Image
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
                    value={award.award}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "award",
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
                handleAddArrayItem({ award: "", year: "" }, awards, setAwards)
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
          {showActivePopup && (
            <Popup
              message=""
              onClose={() => setShowActivePopup(false)}
              collectionName={collectionName}
              showCloseButton={true}
              activeHouse={true}
            />
          )}
          {showSavePopup && (
            <Popup
              message={popupMessage}
              collectionName={""}
              onClose={() => setShowSavePopup(false)}
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
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
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
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </Fragment>
        )}
        {!hasDate && (!onlyPhotos || eventTitle === "gallery") && (
          // When an event does not have a date or isn't only photos the following will be executed
          <Fragment>
            <br />
            <label className="admin-label">Enter Description</label>
            <textarea
              className="description-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Fragment>
        )}
        {hasDate && (
          //If there is a date, then we will ask for the date of the event
          <Fragment>
            <br />
            <label className="admin-label">Enter Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
              }}
            />
            <br />
            <label className="admin-label">Enter Time</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </Fragment>
        )}
        {!hasDate &&
          collectionName !== "campus" &&
          collectionName !== "brotherhood" && (
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
        {showSavePopup && (
          <Popup
            message={popupMessage}
            collectionName={""}
            onClose={() => setShowSavePopup(false)}
            autoClose={true}
            duration={1000}
            showCloseButton={false}
          />
        )}
        {showEventsPopup && (
          <Popup
            message={""}
            onClose={() => setShowEventsPopup(false)}
            collectionName={collectionName}
            showCloseButton={true}
            hasDate={hasDate}
            hasItems={hasItems}
          />
        )}
        {onlyPhotos && (
          <Fragment>
            {showGalleryPopup && (
              <Popup
                message="Gallery Photos"
                onClose={() => setShowGalleryPopup(false)}
                collectionName={collectionName}
                showCloseButton={true}
                showGallery={true}
              />
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
