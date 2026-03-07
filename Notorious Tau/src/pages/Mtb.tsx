import { useState, useEffect, Fragment } from "react";
import { db } from "../components/Admin/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Event } from "../components/EventsFolder/eventData";
import Loading from "../components/Loading";

function Mtb() {
  const [actives, setActives] = useState<Event[]>([]);
  const [executives, setExecutives] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const gallery: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        const activeGallery = gallery.filter((event) =>
          event.id.startsWith("active_"),
        );
        const executiveGallery = gallery.filter((event) =>
          event.id.startsWith("executive_"),
        );

        console.log(gallery);

        setActives(activeGallery);
        setExecutives(executiveGallery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <Loading />;

  return (
    <Fragment>
      <div className="mtb-page">
        <h1>Meet The Chapter</h1>
        <h5>Awarded Brothers</h5>
        <h3>Meet the Bros</h3>
        <div className="executive-active-house">
          <h3>Executives</h3>
          <div className="mtb-image-container">
            {executives.map((exec, index) => (
              <Fragment key={index}>
                <img
                  src={exec.imageURL}
                  alt="active"
                  className="executive-image"
                />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="active-house">
          <h3>Active House</h3>
          <div className="mtb-image-container">
            {actives.map((active, index) => (
              <div className="flip-container">
                <div className="flip-photo" key={index}>
                  <img
                    src={active.imageURL}
                    alt="active"
                    className="active-image front"
                  />
                  <div className="back" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Mtb;
