import "../global.css";
import { Fragment } from "react";
import { useAuthRole, useCollection } from "../../utils/auth";
import { handleDelete } from "../../utils/handle";
import { FaTrash } from "react-icons/fa";
import type { EventItem } from "./eventData";
import CountdownEvent from "./CountdownEvent";

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
            {userRole === "admin" && (
              <button
                className="trash-can-wrapper"
                onClick={() =>
                  handleDelete("events", event.id, event.imagePath)
                }
              >
                <FaTrash className="trash-can" />
              </button>
            )}
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
                      {event.items?.map((item: EventItem, index: number) => (
                        <li key={index}>
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
