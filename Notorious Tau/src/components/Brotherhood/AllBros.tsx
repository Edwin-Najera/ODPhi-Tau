import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Admin/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Event } from "../EventsFolder/eventData";
import "../global.css";
import Popup from "../Admin/Popup";

function AllBros() {
  const [userRole, setUserRole] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //to fetch all events in the collection "events"
        const eventsSnap = await getDocs(
          query(collection(db, "events"), orderBy("createdAt", "asc")),
        );

        //to fetch all events in the collection brotherhood
        const brotherhoodSnap = await getDocs(
          query(collection(db, "brotherhood"), orderBy("createdAt", "desc")),
        );

        //to fetch all events in the collection alumni, this also includes important events
        const alumniSnap = await getDocs(
          query(collection(db, "alumni"), orderBy("date", "desc")),
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

    return () => unsubscribe();
  }, []);

  const handleNavigate = async () => {
    if (userRole === "admin" || userRole === "active") {
      navigate("/Onlybros");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

  //If loading is true display the loading page
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
    <div className="all-bros-page">
      <button className="return-admin" onClick={handleNavigate}>
        Admin Page
      </button>
      {showPopup && (
        <Popup
          message={message}
          onClose={() => setShowPopup(false)}
          collectionName=""
          autoClose={true}
        />
      )}
      <h1 className="page-header">All Events</h1>
    </div>
  );
}

export default AllBros;
