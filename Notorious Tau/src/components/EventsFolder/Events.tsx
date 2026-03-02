import "../global.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Event } from "./eventData";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  //Fetch items from firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const eventsData: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching Events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div id="events-container">
      {events.map((event, index) => (
        <div
          key={index}
          className={`card-container ${index % 2 !== 0 ? "reverse" : null}`}
        >
          <img
            src={event.imageURL}
            className="img-fluid card-event"
            alt="Event"
          />
          <div>
            {/* We will ask the user the event title and the description such that it will be displayed here */}
            <div className="card-text">
              <h1 id="event-title">{event.title}</h1>
              <div>
                <p>{event.description}</p>
                <h5>Prices below</h5>
                {/* We will ask the user which items will be sold and the prices at which they are sold
              This will update as the user adds it */}
                <div id="event-prices">
                  <ul id="sell-items">
                    {event.items.map((item, i) => (
                      <li key={i}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">${item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;
