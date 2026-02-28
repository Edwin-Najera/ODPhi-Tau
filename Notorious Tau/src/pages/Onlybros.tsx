import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../components/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "../components/global.css";
import type { eventItem, event } from "../components/EventsFolder/eventData";

function Onlybros() {
  const [eventTitle, setEventTitle] = useState(""); //For Title of the Event *REQUIRED*
  const [items, setItems] = useState([{ name: "", price: "" }]); //For items and prices of items
  const [description, setDescription] = useState(""); //For description of the event
  const [events, setEvents] = useState<any[]>([]); //List of all events
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventList = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<event, "id">;

        return {
          id: doc.id,
          ...data,
        };
      });
      setEvents(eventList);
    });
    return () => unsubscribe();
  }, []);

  //Handles the deleting of events
  const handleDelete = async (eventId: string, imagePath: string) => {
    //Deleting image from database
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    //Deleting Firestore document
    await deleteDoc(doc(db, "events", eventId));
  };

  //Whenever the admin is going edit the event
  const handleEdit = async (event: any) => {
    setEditingId(event.id);
    setEditTitle(event.eventTitle);
    setEditDescription(event.description || "");
    setEditItems(event.items || []);
  };

  const handleSaveEdit = async (eventId: string) => {
    try {
      await updateDoc(doc(db, "events", eventId), {
        eventTitle: editTitle,
        description: editDescription,
        items: editItems,
      });
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
    if (!imageFile) {
      alert("Image File required");
      return;
    }

    const imagePath = `events/${Date.now()}-${imageFile.name}`;
    const imageRef = ref(storage, imagePath);

    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);

    try {
      await addDoc(collection(db, "events"), {
        eventTitle,
        description,
        imageURL: downloadURL,
        imagePath: imagePath,
        items,
        createdAt: new Date(),
      });

      alert("Event Added");
      setEventTitle("");
      setDescription("");
      setItems([{ name: "", price: "" }]);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  return (
    <div className="admin-page">
      <button className="admin-btn logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="row w-100 d-flex justify-content-around">
        <div className="admin-container">
          <h2 className="admin-header">Events Admin Panel</h2>
          <input
            type="text"
            placeholder="Main Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <br />
          <textarea
            className="description-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
                <input
                  className="input-event"
                  type="text"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          <button className="admin-btn" onClick={addItemField}>
            + Add Another Price
          </button>
          <br />
          <br />
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
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  {editItems.map((item, index) => (
                    <div className="item-row" key={index}>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updatedItems = [...editItems];
                          updatedItems[index].name = e.target.value;
                          setEditItems(updatedItems);
                        }}
                      />
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => {
                          const updatedItems = [...editItems];
                          updatedItems[index].price = e.target.value;
                          setEditItems(updatedItems);
                        }}
                      />
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
                  {event.items?.map((item: eventItem, index: number) => (
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
        <div className="admin-container">
          <h2 className="admin-header">Admin Brotherhood Events</h2>
        </div>
      </div>
    </div>
  );
}

export default Onlybros;
