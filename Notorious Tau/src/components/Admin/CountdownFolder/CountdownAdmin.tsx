import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, Fragment } from "react";
import {
  handleArrayChange,
  handleAddArrayItem,
  handleDeleteArrayItem,
  uploadImage,
  showMessage,
} from "../../../utils/handle";
import Popup from "../PopupFolder/Popup";
import type { Countdown, CountdownEvent } from "../../EventsFolder/eventData";

function CountdownAdmin() {
  const [countdownForm, setCountdownForm] = useState<Partial<Countdown>>({
    title: "",
    targetDate: "",
    events: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const [hasEvents, setHasEvents] = useState(false);
  const [eventList, setEventList] = useState<CountdownEvent[]>([
    { title: "", date: "", location: "", startTime: "", endTime: "" },
  ]);
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });

  const handleSubmit = async () => {
    if (!countdownForm.title || !countdownForm.targetDate) {
      showMessage("Title and Date required", "save", setPopup);
      return;
    } else if (!imageFile) {
      showMessage("Image required", "save", setPopup);
    }

    let imagePath = "";
    let downloadURL = "";

    if (imageFile) {
      const result = await uploadImage(imageFile, "");
      imagePath = result.imagePath;
      downloadURL = result.downloadURL;
    }

    try {
      const newCountdown: any = {
        ...countdownForm,
        imageURL: downloadURL,
        imagePath: imagePath,
        createdAt: new Date(),
      };

      if (hasEvents) {
        newCountdown.events = eventList;
      }

      await addDoc(collection(db, "countdown"), newCountdown);
      showMessage("Countdown successfully Added", "save", setPopup);
      setCountdownForm({
        title: "",
        targetDate: "",
        events: [],
      });
      setEventList([
        { title: "", date: "", location: "", startTime: "", endTime: "" },
      ]);
    } catch (error) {
      showMessage("Error adding countdown", "save", setPopup);
      console.error(error);
    }
  };

  const handleCountdownChanges = (field: keyof Countdown, value: string) => {
    setCountdownForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        <h2 className="admin-header">Countdown Admin Panel</h2>
        <label className="admin-label">Countdown Title</label>
        <input
          type="text"
          placeholder="Event Title"
          value={countdownForm.title}
          onChange={(e) => handleCountdownChanges("title", e.target.value)}
        />
        <label className="admin-label">Event Start Date</label>
        <input
          type="datetime-local"
          placeholder="Event Date"
          value={countdownForm.targetDate}
          onChange={(e) => handleCountdownChanges("date", e.target.value)}
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
                      handleArrayChange(
                        index,
                        "title",
                        e.target.value,
                        eventList,
                        setEventList,
                      )
                    }
                  />
                  <input
                    className="countdown-event-input date"
                    type="date"
                    placeholder="Date"
                    value={event.date}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "date",
                        e.target.value,
                        eventList,
                        setEventList,
                      )
                    }
                  />
                  <input
                    className="countdown-event-input date"
                    type="text"
                    placeholder="Location"
                    value={event.location}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "location",
                        e.target.value,
                        eventList,
                        setEventList,
                      )
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
                        handleArrayChange(
                          index,
                          "startTime",
                          e.target.value,
                          eventList,
                          setEventList,
                        )
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
                        handleArrayChange(
                          index,
                          "endTime",
                          e.target.value,
                          eventList,
                          setEventList,
                        )
                      }
                    />
                  </div>
                  <button
                    className="admin-btn delete-btn item-delete"
                    onClick={() =>
                      handleDeleteArrayItem(index, eventList, setEventList)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              className="admin-btn mb-4"
              onClick={() =>
                handleAddArrayItem(
                  {
                    title: "",
                    date: "",
                    location: "",
                    startTime: "",
                    endTime: "",
                  },
                  eventList,
                  setEventList,
                )
              }
            >
              + Add Another Award
            </button>
          </Fragment>
        )}
        <button className="admin-btn" onClick={() => handleSubmit()}>
          Save Event
        </button>
        {popup.show && (
          <Popup
            message={popup.message}
            collectionName={""}
            onClose={() => setPopup({ show: true, message: "", type: "save" })}
            autoClose={true}
            duration={1000}
            showCloseButton={false}
          />
        )}

        <button
          className="admin-btn show-events-btn mt-2"
          onClick={() => setPopup({ show: true, message: "", type: "active" })}
        >
          Display Events
        </button>
        {popup.show && popup.type === "active" && (
          <Popup
            message=""
            collectionName="countdown"
            onClose={() => setPopup({ show: false, message: "", type: null })}
            showCloseButton={true}
          />
        )}
      </div>
    </div>
  );
}

export default CountdownAdmin;
