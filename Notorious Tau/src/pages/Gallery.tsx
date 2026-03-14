import { useState, useEffect, Fragment } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../components/Admin/firebase";
import type { Event } from "../components/EventsFolder/eventData";

function Gallery() {
  const [photos, setPhotos] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "photos"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const gallery = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        const odpGallery = gallery.filter((event) =>
          event.id.startsWith("gallery_"),
        );

        setPhotos(odpGallery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <div className="image-description-container">
              <img src={photo.imageURL} className="odphi-gallery-image" />
              <p className="image-description">{photo.description}</p>
            </div>
            {index !== photos.length - 1 && index % 2 === 0 && (
              <div className="part-line"></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
