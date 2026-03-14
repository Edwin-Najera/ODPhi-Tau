import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Admin/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Event } from "../EventsFolder/eventData";
import "../global.css";
import Popup from "../Admin/Popup";
import Loading from "../Loading";

function AllBros() {
  const [userRole, setUserRole] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [brotherhoodEvents, setBrotherhoodEvents] = useState<Event[]>([]);
  const [alumniEvents, setAlumniEvents] = useState<Event[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //to fetch all events in the collection "events"
        const eventsSnap = await getDocs(
          query(collection(db, "events"), orderBy("createdAt", "desc")),
        );

        //to fetch all events in the collection brotherhood
        const brotherhoodSnap = await getDocs(
          query(collection(db, "brotherhood"), orderBy("createdAt", "desc")),
        );

        //to fetch all events in the collection alumni, this also includes important events
        const alumniSnap = await getDocs(
          query(collection(db, "alumni"), orderBy("date", "asc")),
        );

        setEvents(
          eventsSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Event, "id">),
          })),
        );

        setBrotherhoodEvents(
          brotherhoodSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Event, "id">),
          })),
        );

        setAlumniEvents(
          alumniSnap.docs.map((doc) => {
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
      } catch (error) {
        console.error(error);
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
      navigate("/Alumni");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

  return (
    <div className="all-bros-page">
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
          Alumni Page
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
      <h1 className="page-header">All Events</h1>
      <div className="all-bros-all-events">
        <h3 className="all-bros-header">Events</h3>
        {loading && <Loading />}
        <div className="all-bros-events">
          {events.map((event, index) => (
            <div className="all-bros-event-container" key={index}>
              <h2 className="all-bros-title">{event.eventTitle}</h2>
              <img
                className="img-fluid all-bros-image"
                src={event.imageURL}
                alt="event"
              />
            </div>
          ))}
        </div>
        <h3 className="all-bros-header">Brotherhood Events</h3>
        {loading && <Loading />}
        <div className="all-bros-events">
          {brotherhoodEvents.map((event, index) => (
            <div className="all-bros-event-container" key={index}>
              <div className="brotherhood-container">
                <span className="all-bros-title">{event.eventTitle}</span>
                <span className="brotherhood-description">
                  {event.description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h3 className="all-bros-header">Important Events and Dates</h3>
        {loading && <Loading />}
        <div className="all-bros-events important-events">
          {alumniEvents.map((event, index) => (
            <div className="alumni-event-container" key={index}>
              <h2 className="alumni-event-title all-bros-event-title">
                {event.eventTitle}
              </h2>
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
      </div>
    </div>
  );
}

export default AllBros;
