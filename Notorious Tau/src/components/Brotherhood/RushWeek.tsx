import { useState, useEffect } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";
import { uploadImage, showMessage } from "../../utils/handle";
import Popup from "../Admin/PopupFolder/Popup";

function RushWeek() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });

  useEffect(() => {
    const fetchCurrent = async () => {
      const snap = await getDoc(doc(db, "events", "rushweek"));
      if (snap.exists()) {
        setCurrentPath(snap.data().flyerPath || null);
        setCurrentURL(snap.data().flyerURL || null);
      }
    };

    fetchCurrent();
  }, []);

  const handleUpload = async () => {
    if (!imageFile) {
      showMessage("No image selected", "save", setPopup);
      return;
    }

    if (currentPath) {
      try {
        await deleteObject(ref(storage, currentPath));
      } catch (error) {
        console.error("Error deleting previous image:", error);
      }
    }

    const result = await uploadImage(imageFile, "rushweek");
    await setDoc(doc(db, "rushweek", "rushweek"), {
      title: "Rush Week",
      flyerURL: result.downloadURL,
      flyerPath: result.imagePath,
      updatedAt: new Date(),
    });

    setCurrentURL(result.downloadURL);
    setCurrentPath(result.imagePath);
    showMessage("Rush Week Flyer updated successfully", "save", setPopup);
    setImageFile(null);
  };
  return (
    <div>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: null })}
        />
      )}
      <h4>Add New Rush Week Flyer</h4>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) setImageFile(e.target.files[0]);
        }}
      />
      <button className="admin-btn" onClick={handleUpload}>
        {currentURL ? "Replace Flyer" : "Upload Flyer"}
      </button>
    </div>
  );
}

export default RushWeek;
