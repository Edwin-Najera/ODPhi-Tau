import { useState, useEffect, Fragment } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { EventItem, Event } from "../EventsFolder/eventData";
import "../global.css";
import Popup from "./Popup";

type Props = {
  collectionName: string;
  panelTitle: string;
  hasItems: boolean;
  hasDate: boolean;
  onlyPhotos: boolean;
};

function AdminPanel({
  collectionName,
  panelTitle,
  hasItems = false,
  hasDate = false,
  onlyPhotos = false,
}: Props) {
  const [eventTitle, setEventTitle] = useState(""); //For Title of the Event *REQUIRED*
  const [items, setItems] = useState([{ name: "", price: "" }]); //For items and prices of items
  const [description, setDescription] = useState(""); //For description of the event
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  //Whenever an item is being added to the event
  const handleItemChange = (
    index: number,
    field: "name" | "price",
    value: string,
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemField = () => {
    setItems([...items, { name: "", price: "" }]);
  };

  const deleteItemField = (index: number) => {
    const updateItems = items.filter((_, i) => i !== index);
    setItems(updateItems);
  };

  const handleSubmit = async () => {
    let message = "";
    if (!eventTitle) {
      message = onlyPhotos ? "Please Choose a Gallery" : "Event Title Required";

      setPopupMessage(message);
      setShowSavePopup(true);
      return;
    }
    if (!imageFile && (!hasDate || onlyPhotos) && collectionName !== "campus") {
      message = "Image File required";
      setPopupMessage(message);
      setShowSavePopup(true);
      return;
    }
    if (hasDate && eventDate === "") {
      message = "Event date Required";
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
        createdAt: new Date(),
      };

      if (imageFile) {
        newEvent.imageURL = downloadURL;
        newEvent.imagePath = imagePath;
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
      } else {
        newEvent.description = description;
      }

      if (onlyPhotos) {
        const collectionRef = collection(db, "photos");

        const autoId = doc(collectionRef).id;
        let customId = "";

        if (eventTitle === "alumni") {
          customId = `alumni_${autoId}`;
        } else if (eventTitle === "gallery") {
          customId = `gallery_${autoId}`;
        }

        await setDoc(doc(db, collectionName, customId), newEvent);
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
      setItems([{ name: "", price: "" }]);
    } catch (error) {
      message = "Error adding event";
      setPopupMessage(message);
      setShowSavePopup(true);
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        <h2 className="admin-header">{panelTitle}</h2>
        {onlyPhotos && (
          <select
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          >
            <option value="">Choose Gallery</option>
            <option value="alumni">Alumni Gallery</option>
            <option value="gallery">Gallery</option>
          </select>
        )}
        {!onlyPhotos && (
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        )}
        {!hasDate && !onlyPhotos && (
          <Fragment>
            <br />
            <textarea
              className="description-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Fragment>
        )}
        {hasDate && (
          <Fragment>
            <br />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
              }}
            />
            <br />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </Fragment>
        )}
        {!hasDate && collectionName !== "campus" && (
          <Fragment>
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </Fragment>
        )}
        {hasItems && (
          <Fragment>
            <h3>Price Options</h3>
            <div className="item-input">
              {items.map((item, index) => (
                <div className="item-row" key={index}>
                  <input
                    className="input-event"
                    type="text"
                    placeholder="Item Title"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
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
                        handleItemChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() => deleteItemField(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button className="admin-btn col" onClick={addItemField}>
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
        {!onlyPhotos && (
          <button
            className="admin-btn show-events-btn mt-2"
            onClick={() => setShowEventsPopup(true)}
          >
            Display Events
          </button>
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
            <button
              className="admin-btn mt-2"
              onClick={() => setShowGalleryPopup(true)}
            >
              Display Gallery
            </button>
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
