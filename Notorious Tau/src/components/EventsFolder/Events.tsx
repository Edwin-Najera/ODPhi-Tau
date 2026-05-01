import "../global.css";
import { Fragment, useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import type { Event, Countdown } from "./eventData";
import CountdownEvent from "./CountdownEvent";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [loading, setLoading] = useState(true);

  //Fetch items from firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "desc"),
        );
        const countdownQuery = query(
          collection(db, "countdown"),
          orderBy("createdAt", "desc"),
        );

        const snapshotEvents = await getDocs(eventQuery);
        const snapshotCountdown = await getDocs(countdownQuery);

        const eventsData: Event[] = snapshotEvents.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        const countdownData: Countdown[] = snapshotCountdown.docs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Countdown, "id">),
          }),
        );

        setEvents(eventsData);
        setCountdowns(countdownData);
      } catch (error) {
        console.error("Error fetching Events", error);
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
    <Fragment>
      {countdowns.length > 0 && (
        <Fragment>
          {countdowns.map((countdown, index) => (
            <Fragment key={index}>
              <CountdownEvent countdown={countdown} />
              <br />
            </Fragment>
          ))}
        </Fragment>
      )}
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
                <h1 className="event-title">{event.eventTitle}</h1>
                <div>
                  <p>{event.description}</p>
                  <h5>Prices below</h5>
                  {/* We will ask the user which items will be sold and the prices at which they are sold
                This will update as the user adds it */}
                  <div className="event-prices">
                    <ul className="sell-items">
                      {event.items?.map((item, i) => (
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
    </Fragment>
  );
}

export default Events;
