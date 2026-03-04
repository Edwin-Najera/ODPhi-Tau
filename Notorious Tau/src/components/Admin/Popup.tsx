import { useState, useEffect, Fragment } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import type { EventItem, Event } from "../EventsFolder/eventData";
import "../global.css";

type PopupProps = {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  showCloseButton?: boolean;
  duration?: number;
  showGallery?: boolean;
};

function Popup({
  message,
  onClose,
  autoClose = false,
  showCloseButton = false,
  duration = 1000,
  showGallery = false,
}: PopupProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (showGallery) {
      const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const eventData: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        setEvents(eventData);
      });
    }

    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose, showGallery]);

  const handleDeleteImage = async (eventId: string, imagePath?: string) => {
    //Deleting image from database
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    //Deleting Firestore document
    await deleteDoc(doc(db, "photos", eventId));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        {showGallery && (
          <div className="gallery-container">
            {events.map((event) => (
              <Fragment key={event.id}>
                <div className="gallery-image-container">
                  <div>Gallery: {event.eventTitle}</div>
                  <img
                    className="gallery-image"
                    src={event.imageURL}
                    alt="Gallery Photo"
                  />
                  <button
                    className="admin-btn delete-btn mt-2"
                    onClick={() => handleDeleteImage(event.id, event.imagePath)}
                  >
                    Delete Photo
                  </button>
                </div>
              </Fragment>
            ))}
          </div>
        )}
        {showCloseButton && (
          <button className="admin-btn close-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export default Popup;
