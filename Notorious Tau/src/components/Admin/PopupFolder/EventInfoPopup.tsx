import type {
  BaseDocument,
  Alumni,
  EventItem,
} from "../../EventsFolder/eventData";

type EventInfoProps = {
  event: BaseDocument | null;
  onClose: () => void;
};

function EventInfoPopup({ event, onClose }: EventInfoProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-box event-info"
        onClick={(e) => e.stopPropagation()}
      >
        {!event ? (
          <p>Could not load... Try Again</p>
        ) : (
          <>
            <div className="popup-title">
              <h4>{event.title}</h4>
              <button
                type="button"
                className="btn btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            {event.date && (
              <p>
                Date:{" "}
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {event.imagePath && (
              <img src={event.imageURL} className="img-fluid card-event" />
            )}
            {event.description && <p>{event.description}</p>}
            {event.items && event.items.length > 0 && (
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
            {(event as Alumni).location && (
              <p>Location: {(event as Alumni).location}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EventInfoPopup;
