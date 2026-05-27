import "../global.css";
import { useNavigate } from "react-router-dom";
import { useAuthRole, useCollection } from "../../utils/auth";
import type { EventItem } from "./eventData";
import CountdownEvent from "./CountdownEvent";
import UserControls from "../Admin/AdminScreen/UserControls";

function Events() {
  const events = useCollection({
    collectionName: "events",
    activeHouse: false,
    onlyPhotos: false,
  });
  const countdowns = useCollection({
    collectionName: "countdown",
    activeHouse: false,
    onlyPhotos: false,
  });
  const { userRole } = useAuthRole();
  const navigate = useNavigate();

  return (
    <div
      className="events-container"
      style={
        events.length <= 0 && countdowns.length <= 0 ? { display: "none" } : {}
      }
    >
      {countdowns.map((countdown) => (
        <CountdownEvent key={countdown.id} countdown={countdown} />
      ))}
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`card card-container ${index % 2 !== 0 ? "reverse" : ""}`}
        >
          <UserControls
            userRole={userRole}
            collectionName="events"
            event={event}
            navigate={navigate}
          />
          <img
            src={event.imageURL}
            className="img-fluid card-event"
            alt="Event"
          />
          <div className="event-card-info">
            <div className="card-text">
              <h1 className="event-title">{event.title}</h1>
              <p>{event.description}</p>
              {event.items?.length > 0 && (
                <>
                  <h5>Prices below</h5>
                  <div className="event-prices">
                    <ul className="sell-items">
                      {event.items?.map((item: EventItem, index: number) => (
                        <li key={index}>
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {event.linkURL && (
                <a
                  href={event.linkURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;
