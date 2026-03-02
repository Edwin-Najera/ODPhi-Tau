import { useState, useEffect, Fragment } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
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

type Props = {
  collectionName: string;
  panelTitle: string;
  hasItems: boolean;
  hasDate: boolean;
};

function AdminPanel({
  collectionName,
  panelTitle,
  hasItems = false,
  hasDate = false,
}: Props) {
  const [eventTitle, setEventTitle] = useState(""); //For Title of the Event *REQUIRED*
  const [items, setItems] = useState([{ name: "", price: "" }]); //For items and prices of items
  const [description, setDescription] = useState(""); //For description of the event
  const [events, setEvents] = useState<Event[]>([]); //List of all events
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*

  //Fetches events
  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList: Event[] = snapshot.docs.map((doc) => {
        const rawData = doc.data();

        return {
          id: doc.id,
          ...rawData,
          date: rawData.date?.toDate ? rawData.date.toDate() : rawData.date,
        } as Event;
      });
      setEvents(eventList);
    });
    return () => unsubscribe();
  }, [collectionName]);

  //Handles the deleting of events
  const handleDelete = async (eventId: string, imagePath?: string) => {
    //Deleting image from database
    if (!hasDate) {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    }

    //Deleting Firestore document
    await deleteDoc(doc(db, collectionName, eventId));
  };

  //Whenever the admin is going edit the event
  const handleEdit = async (event: any) => {
    setEditingId(event.id);
    setEditTitle(event.eventTitle);
    setEditDescription(event.description || "");
    setEditItems(event.items || []);
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
      } else {
        updateData.description = editDescription;
      }

      console.log("editDate", editDate);
      console.log("parsed", new Date(editDate));
      await updateDoc(doc(db, collectionName, eventId), updateData);

      setEditingId(null);
    } catch (error) {
      console.error("Error editing: ", error);
    }
  };

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

  const handleSubmit = async () => {
    if (!eventTitle) {
      alert("Event Title Required");
      return;
    }
    if (!imageFile && !hasDate) {
      alert("Image File required");
      return;
    }
    if (hasDate && eventDate === "") {
      alert("Event date Required");
      return;
    }

    let imagePath = "";
    let downloadURL = "";

    if (imageFile) {
      imagePath = `events/${Date.now()}-${imageFile?.name}`;
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
          alert("Date and Time Required");
          return;
        }

        const combinedDateTime = new Date(`${eventDate}T${eventTime}`);

        if (isNaN(combinedDateTime.getTime())) {
          alert("Invalid Date/Time");
          return;
        }

        newEvent.date = combinedDateTime;
      } else {
        newEvent.description = description;
      }

      await addDoc(collection(db, collectionName), newEvent);

      alert("Event Added");
      setEventTitle("");
      setDescription("");
      setEventDate("");
      setEventTime("");
      setItems([{ name: "", price: "" }]);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        <h2 className="admin-header">{panelTitle}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        {!hasDate && (
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
        {!hasDate && (
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
                </div>
              ))}
            </div>
            <button className="admin-btn" onClick={addItemField}>
              + Add Another Price
            </button>
          </Fragment>
        )}
        <br />
        {!hasDate && <br />}
        <button className="admin-btn" onClick={handleSubmit}>
          Save Event
        </button>
        <hr />
        <h3>Existing Events</h3>
        {events.map((event) => (
          <div key={event.id}>
            {editingId === event.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                {!hasDate && (
                  <textarea
                    className="description-input"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                )}
                {hasDate && (
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
                {hasItems &&
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
              <div>
                <h4>{event.eventTitle}</h4>
                <p>{event.description}</p>
                {hasDate && event.date && (
                  <p>
                    <strong>Date</strong>{" "}
                    {new Date(event.date).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {hasItems &&
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
                    onClick={() => handleDelete(event.id, event.imagePath)}
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
