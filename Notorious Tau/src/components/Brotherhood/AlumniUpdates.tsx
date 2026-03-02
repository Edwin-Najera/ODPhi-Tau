import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../Admin/firebase";
import type { Event } from "../EventsFolder/eventData";
import "../global.css";

function AlumniUpdates() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "campus"), orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const eventsData: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
    <div className="alumni-events">
      <h3 className="alumni-header">Updates</h3>
      {events.map((event, index) => (
        <div key={index} className="alumni-updates-container">
          <div className="alumni-event-title">{event.eventTitle}</div>
          <div className="alumni-event-description">{event.description}</div>
        </div>
      ))}
    </div>
  );
}

export default AlumniUpdates;
