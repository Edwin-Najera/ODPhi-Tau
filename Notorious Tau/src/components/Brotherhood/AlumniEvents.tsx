import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../Admin/firebase";
import type { Event } from "../EventsFolder/eventData";
import "../global.css";

function AlumniEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "alumni"), orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const eventsData: Event[] = snapshot.docs.map((doc) => {
          const rawData = doc.data();

          return {
            id: doc.id,
            ...rawData,
            date: rawData.date?.toDate ? rawData.date.toDate() : rawData.date,
            createdAt: rawData.createdAt?.toDate
              ? rawData.createdAt.toDate()
              : rawData.createdAt,
          } as Event;
        });

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
  );
}

export default AlumniEvents;
