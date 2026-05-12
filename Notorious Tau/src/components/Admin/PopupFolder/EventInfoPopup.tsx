import type { BaseDocument, Alumni } from "../../EventsFolder/eventData";

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
            {event.description && <p>{event.description}</p>}
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
