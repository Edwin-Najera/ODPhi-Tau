import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../components/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Onlybros() {
  const [eventTitle, setEventTitle] = useState("");
  const [items, setItems] = useState([{ itemName: "", price: "" }]);
  const [events, setEvents] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const querySnapshots = await getDocs(collection(db, "events"));
    const eventsData = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventsData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents(); // refresh list
  };

  const handleItemChange = (
    index: number,
    field: "itemName" | "price",
    value: string,
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemField = () => {
    setItems([...items, { itemName: "", price: "" }]);
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

    const imageRef = ref(storage, `events/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);

    try {
      await addDoc(collection(db, "events"), {
        eventTitle,
        imageURL: downloadURL,
        items,
        createdAt: new Date(),
      });

      alert("Event Added");
      setEventTitle("");
      setItems([{ itemName: "", price: "" }]);
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
    <div style={{ padding: "2rem", color: "black" }}>
      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>
      <h2>Onlybros Admin Panel</h2>

      <input
        type="text"
        placeholder="Main Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
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

      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Item Title"
            value={item.itemName}
            onChange={(e) =>
              handleItemChange(index, "itemName", e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>
      ))}

      <button onClick={addItemField}>+ Add Another Price</button>

      <br />
      <br />

      <button onClick={handleSubmit}>Save Event</button>
      <hr />
      <h3>Existing Events</h3>

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            marginBottom: "20px",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <h4>{event.eventTitle}</h4>

          {event.items?.map((item: any, index: number) => (
            <p key={index}>
              {item.itemName} — {item.price}
            </p>
          ))}

          <button onClick={() => handleDelete(event.id)}>Delete Event</button>
        </div>
      ))}
    </div>
  );
}

export default Onlybros;
