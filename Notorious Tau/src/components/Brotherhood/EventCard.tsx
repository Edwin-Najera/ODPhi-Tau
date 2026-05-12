import type { BaseDocument } from "../EventsFolder/eventData";
import type { NavigateFunction } from "react-router-dom";
import UserControls from "../Admin/AdminScreen/UserControls";

type EventCardProps = {
  event: BaseDocument;
  collectionName: string;
  userRole: string | null;
  navigate: NavigateFunction;
  onEventClick: (event: BaseDocument) => void;
};

function EventCard({
  event,
  collectionName,
  userRole,
  navigate,
  onEventClick,
}: EventCardProps) {
  return (
    <div className="all-event-wrapper card">
      <div className="event-clickable" onClick={() => onEventClick(event)}>
        <h4>{event.title}</h4>
        <p>Click for more info</p>
      </div>
      <UserControls
        userRole={userRole}
        collectionName={collectionName}
        event={event}
        navigate={navigate}
      />
    </div>
  );
}

export default EventCard;
