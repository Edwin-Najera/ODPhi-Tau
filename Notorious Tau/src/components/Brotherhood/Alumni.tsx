import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Admin/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Event } from "../EventsFolder/eventData";
import "../global.css";
import Popup from "../Admin/Popup";

function Alumni() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [updates, setUpdates] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<Event[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //This is for fetching important events
        const eventsSnap = await getDocs(
          query(collection(db, "alumni"), orderBy("date", "asc")),
        );

        //To fetch updates from the collection campus
        const updatesSnap = await getDocs(
          query(collection(db, "campus"), orderBy("createdAt", "desc")),
        );

        //To fetch all images that are for the alumni gallery
        const gallerySnap = await getDocs(
          query(collection(db, "photos"), orderBy("createdAt", "desc")),
        );

        setEvents(
          eventsSnap.docs.map((doc) => {
            const rawData = doc.data();

            return {
              id: doc.id,
              ...rawData,
              date: rawData.date?.toDate ? rawData.date.toDate() : rawData.date,
              createdAt: rawData.createdAt?.toDate
                ? rawData.createdAt.toDate()
                : rawData.createdAt,
            } as Event;
          }),
        );

        setUpdates(
          updatesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Event, "id">),
          })),
        );

        const gallery = gallerySnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        const alumniGallery = gallery.filter((event) =>
          event.id.startsWith("alumni_"),
        );

        setGallery(alumniGallery);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const tokenResult = await user?.getIdTokenResult();
      setUserRole(tokenResult?.claims.role as string);
    });

    fetchData();
    return () => unsubscribe();
  }, []);

  const handleNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location == "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/AllBros");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

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
    <div className="alumni-page">
      <div className="top-of-page">
        <button
          className="return-admin"
          onClick={() => handleNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button
          className="return-admin return-previous"
          onClick={() => handleNavigate("alumni")}
        >
          Brotherhood Page
        </button>
      </div>
      {showPopup && (
        <Popup
          message={message}
          onClose={() => setShowPopup(false)}
          collectionName=""
          autoClose={true}
        />
      )}
      <h1 className="page-header">Welcome to The Tau Alumni Page</h1>
      <div className="alumni-newsletter">
        <div className="alumni-events">
          <h3 className="alumni-header">Important Events & Dates</h3>
          {events.map((event, index) => (
            <div key={index} className="alumni-event-container">
              <div className="alumni-event-title">{event.eventTitle}</div>
              <div className="alumni-event-date">
                {event.date?.toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="alumni-events">
          <h3 className="alumni-header">Updates</h3>
          {updates.map((event, index) => (
            <div key={index} className="alumni-updates-container">
              <div className="alumni-event-title">{event.eventTitle}</div>
              <div className="alumni-event-description">
                {event.description}
              </div>
            </div>
          ))}
        </div>
        <div className="alumni-events">
          <h3 className="alumni-header">Month Recap</h3>
          {gallery.map((event, index) => (
            <div key={index} className="alumni-image-container">
              <img className="recap-image" src={event.imageURL} alt="Recap" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Alumni;
