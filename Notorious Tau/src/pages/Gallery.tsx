import { useState, useEffect, Fragment } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { getUserRole } from "../utils/auth";
import { useDelete } from "../utils/handle";
import type { Event } from "../components/EventsFolder/eventData";
import { FaTrash } from "react-icons/fa";

function Gallery() {
  const [photos, setPhotos] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const queryPhotos = query(
      collection(db, "photos"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribeSnapshot = onSnapshot(queryPhotos, (snapshot) => {
      const galleryPhotos = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }))
        .filter((event) => event.id.startsWith("gallery_"));
      setPhotos(galleryPhotos);
      setLoading(false);
    });

    const unsubscribeAuth = getUserRole((role) => setUserRole(role));

    return () => {
      unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-ball" id="loading-one" />
        <div className="loading-ball" id="loading-two" />
        <div className="loading-ball" id="loading-three" />
      </div>
    );
  }

  return (
    <div className="odphi-gallery-page">
      <div className="odphi-gallery-title">
        <h1>
          Omega Delta Phi
          <br />
          Year Highlights
        </h1>
      </div>
      <div className="odphi-gallery-container">
        {photos.map((photo, index) => (
          <Fragment key={index}>
            <div className="gallery-card">
              {userRole === "admin" && (
                <button
                  className="btn trash-can-wrapper"
                  onClick={() => useDelete("photos", photo.id, photo.imagePath)}
                >
                  <FaTrash className="trash-can" />
                </button>
              )}
              <img src={photo.imageURL} className="odphi-gallery-image" />
              <div className="line-separate" />
              <p className="image-description">{photo.description}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
