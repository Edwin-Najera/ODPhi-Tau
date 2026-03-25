import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useState, Fragment } from "react";
import Popup from "../Popup";

function CountdownAdmin() {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const [hasEvents, setHasEvents] = useState(false);
  const [eventList, setEventList] = useState([
    { title: "", date: "", location: "", startTime: "", endTime: "" },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDisplayPopup, setShowDisplayPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!title || !targetDate) {
      setShowPopup(true);
      setMessage("Title and Date required");
      return;
    } else if (!imageFile) {
      setShowPopup(true);
      setMessage("Image required");
    }

    let imagePath = "";
    let downloadURL = "";

    if (imageFile) {
      imagePath = `${Date.now()}-${imageFile?.name}`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, imageFile);

      downloadURL = await getDownloadURL(imageRef);
    }

    try {
      const newCountdown: any = {
        title,
        targetDate,
        imageURL: downloadURL,
        imagePath: imagePath,
        createdAt: new Date(),
      };

      if (hasEvents) {
        newCountdown.events = eventList;
      }

      await addDoc(collection(db, "countdown"), newCountdown);
      setShowPopup(true);
      setMessage("Countdown successfully Added");
      setTitle("");
      setTargetDate("");
      setEventList([
        { title: "", date: "", location: "", startTime: "", endTime: "" },
      ]);
    } catch (error) {
      setMessage("Error adding countdown");
      setShowPopup(true);
      console.error(error);
    }
  };

  const handleEventChange = (
    index: number,
    field: "title" | "date" | "location" | "startTime" | "endTime",
    value: string,
  ) => {
    const updatedEvent = [...eventList];
    updatedEvent[index][field] = value;
    setEventList(updatedEvent);
  };

  const addEventItem = () => {
    setEventList([
      ...eventList,
      { title: "", date: "", location: "", startTime: "", endTime: "" },
    ]);
  };

  const deleteEventItem = (index: number) => {
    const updateItems = eventList.filter((_, i) => i !== index);
    setEventList(updateItems);
  };

  return (
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        <h2 className="admin-header">Countdown Admin Panel</h2>
        <label className="admin-label">Countdown Title</label>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="admin-label">Event Start Date</label>
        <input
          type="datetime-local"
          placeholder="Event Date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <label className="admin-label">Event Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImageFile(e.target.files[0]);
            }
          }}
        />
        <form>
          <input
            className="admin-checkbox"
            type="checkbox"
            id="has-events"
            onChange={() => setHasEvents(!hasEvents)}
          />
          <label className="admin-label" htmlFor="has-events">
            Has Events
          </label>
        </form>
        {hasEvents && (
          <Fragment>
            <div className="event-countdown-input-container">
              <label htmlFor="countdown" className="admin-label">
                Enter Events
              </label>
              {eventList.map((event, index) => (
                <div id="countdown" className="countdown-event-row" key={index}>
                  <input
                    className="countdown-event-input title"
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={event.title}
                    onChange={(e) =>
                      handleEventChange(index, "title", e.target.value)
                    }
                  />
                  <input
                    className="countdown-event-input date"
                    type="date"
                    placeholder="Date"
                    value={event.date}
                    onChange={(e) =>
                      handleEventChange(index, "date", e.target.value)
                    }
                  />
                  <input
                    className="countdown-event-input date"
                    type="text"
                    placeholder="Location"
                    value={event.location}
                    onChange={(e) =>
                      handleEventChange(index, "location", e.target.value)
                    }
                  />
                  <div className="countdown-event-input-col">
                    <label htmlFor="start">Start Time:</label>
                    <input
                      id="start"
                      className="countdown-event-input start"
                      type="time"
                      placeholder="Start Time"
                      value={event.startTime}
                      onChange={(e) =>
                        handleEventChange(index, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="countdown-event-input-col">
                    <label htmlFor="end">End Time:</label>
                    <input
                      id="end"
                      className="countdown-event-input end"
                      type="time"
                      placeholder="End Time"
                      value={event.endTime}
                      onChange={(e) =>
                        handleEventChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() => deleteEventItem(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button className="admin-btn mb-4" onClick={addEventItem}>
              + Add Another Award
            </button>
          </Fragment>
        )}
        <button className="admin-btn" onClick={() => handleSubmit()}>
          Save Event
        </button>
        {showPopup && (
          <Popup
            message={message}
            collectionName={""}
            onClose={() => setShowPopup(false)}
            autoClose={true}
            duration={1000}
            showCloseButton={false}
          />
        )}

        <button
          className="admin-btn show-events-btn mt-2"
          onClick={() => setShowDisplayPopup(true)}
        >
          Display Events
        </button>
        {showDisplayPopup && (
          <Popup
            message=""
            collectionName="countdown"
            onClose={() => setShowDisplayPopup(false)}
            showCloseButton={true}
          />
        )}
      </div>
    </div>
  );
}

export default CountdownAdmin;
