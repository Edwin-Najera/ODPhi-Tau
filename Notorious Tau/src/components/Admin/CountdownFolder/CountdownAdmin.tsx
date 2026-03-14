import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useState } from "react";
import Popup from "../Popup";

function CountdownAdmin() {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); //For the image/flyer of the event *REQUIRED*
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

      await addDoc(collection(db, "countdown"), newCountdown);
      setShowPopup(true);
      setMessage("Countdown successfully Added");
    } catch (error) {
      setMessage("Error adding countdown");
      setShowPopup(true);
      console.error(error);
    }
  };

  return (
    <div className="row w-100 d-flex justify-content-around">
      <div className="admin-container">
        <h2 className="admin-header">Countdown Admin Panel</h2>
        <label className="admin-label">Event Title</label>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="admin-label">Event Date</label>
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
