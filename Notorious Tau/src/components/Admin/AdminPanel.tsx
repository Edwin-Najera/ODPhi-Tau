import { useState, Fragment } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../global.css";
import Popup from "./Popup";

type Props = {
  collectionName: string;
  panelTitle: string;
  hasItems?: boolean;
  hasDate?: boolean;
  onlyPhotos?: boolean;
  activeHouse?: boolean;
};

function AdminPanel({
  collectionName,
  panelTitle,
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
  const [knights, setKnights] = useState({
    name: "",
    position: "",
    knightName: "",
    lineNumber: "",
    lineName: "",
    crossDate: "",
  });
  const [awards, setAwards] = useState([{ award: "" }]);
  const [type, setType] = useState("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [showActivePopup, setShowActivePopup] = useState(false);
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

  //Whenever a knight is added to a gallery
  const handleKnightChange = (
    field:
      | "name"
      | "position"
      | "knightName"
      | "lineNumber"
      | "lineName"
      | "crossDate"
      | "createdAta",
    value: string,
  ) => {
    setKnights((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAwardChange = (index: number, field: "award", value: string) => {
    const updatedAwards = [...awards];
    updatedAwards[index][field] = value;
    setAwards(updatedAwards);
  };

  const addAwardField = () => {
    setAwards([...awards, { award: "" }]);
  };

  const deleteAwardField = (index: number) => {
    const updateAwards = awards.filter((_, i) => i !== index);
    setAwards(updateAwards);
  };

  const handleSubmit = async () => {
    console.log("button clicked");
    let message = "";
    if (!activeHouse) {
      console.log("no title");
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
    console.log("checks complete");

    let imagePath = "";
    let downloadURL = "";

    console.log("creating Image url");
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
        name: knights.name,
        position: knights.position,
        knightName: knights.knightName,
        lineNumber: knights.lineNumber,
        lineName: knights.lineName,
        crossDate: knights.crossDate,
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

      if (onlyPhotos || activeHouse) {
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
      setKnights({
        name: "",
        position: "",
        knightName: "",
        lineNumber: "",
        lineName: "",
        crossDate: "",
      });
      setItems([{ name: "", price: "" }]);
    } catch (error) {
      message = "Error adding event";
      setPopupMessage(message);
      setShowSavePopup(true);
      console.error("Error adding event: ", error);
    }
  };

  if (activeHouse) {
    return (
      <div className="row w-100 d-flex justify-content-around">
        <div className="admin-container">
          <h2 className="admin-header">{panelTitle}</h2>
          <label className="admin-label">Choose a Gallery</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Choose Gallery</option>
            <option value="active">Active</option>
            <option value="executive">Executive</option>
          </select>
          <label className="admin-label">Enter Name</label>
          <input
            className="knight-input"
            type="text"
            placeholder="Name"
            onChange={(e) => handleKnightChange("name", e.target.value)}
          />
          <label className="admin-label">Enter Position</label>
          <input
            className="knight-input"
            type="text"
            placeholder="Position"
            onChange={(e) => handleKnightChange("position", e.target.value)}
          />
          <label className="admin-label">Enter Knight Name</label>
          <input
            className="knight-input"
            type="text"
            placeholder="Knight Name"
            onChange={(e) => handleKnightChange("knightName", e.target.value)}
          />
          <label className="admin-label">Enter Line Number</label>
          <input
            className="knight-input"
            type="number"
            placeholder="Line Number"
            onChange={(e) => handleKnightChange("lineNumber", e.target.value)}
          />
          <label className="admin-label">Enter Line Name</label>
          <input
            className="knight-input"
            type="text"
            placeholder="Line Name"
            onChange={(e) => handleKnightChange("lineName", e.target.value)}
          />
          <label className="admin-label">Enter Cross Date</label>
          <input
            className="knight-input"
            type="text"
            placeholder="Cross Date Semester-Year"
            onChange={(e) => handleKnightChange("crossDate", e.target.value)}
          />
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
          <Fragment>
            <div className="awards-input">
              <label className="admin-label">Enter awards</label>
              {awards.map((award, index) => (
                <div className="knight-row" key={index}>
                  <input
                    className="knight-input"
                    type="text"
                    placeholder="Award"
                    value={award.award}
                    onChange={(e) =>
                      handleAwardChange(index, "award", e.target.value)
                    }
                  />
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() => deleteAwardField(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button className="admin-btn" onClick={addAwardField}>
              + Add Another Award
            </button>
          </Fragment>
          <br />
          <br />
          <button className="admin-btn" onClick={() => handleSubmit()}>
            Save Event
          </button>
          <button
            className="admin-btn mt-2"
            onClick={() => setShowActivePopup(true)}
          >
            Display Gallery
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
        <h2 className="admin-header">{panelTitle}</h2>
        {onlyPhotos && (
          // Specifically for inputting only photos, only a title in which the title is the database, and photo are needed
          <Fragment>
            <label className="admin-label">Choose a Gallery</label>
            <select
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            >
              <option value="">Choose Gallery</option>
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
