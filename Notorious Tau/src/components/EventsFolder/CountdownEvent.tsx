import {} from "react";
import type { Countdown } from "./eventData";
import { useInView } from "react-intersection-observer";
import { useAuthRole } from "../../utils/auth";
import { handleDelete } from "../../utils/handle";
import { FaTrash } from "react-icons/fa";
import { CiCalendar, CiTimer, CiLocationOn } from "react-icons/ci";
import CountdownDisplay from "../Admin/CountdownFolder/CountdownDisplay";

function CountdownEvent({ countdown }: { countdown: Countdown }) {
  const { ref: countdownRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });
  const { userRole } = useAuthRole();

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div ref={countdownRef} className="countdown-events-container">
        <div
          className={`countdown-display-container ${visibleElement ? "animate-countdown" : ""}`}
        >
          <img
            src={countdown.imageURL}
            alt="Countdown Image"
            className="countdown-image"
          />
          {userRole === "admin" && (
            <button
              className="trash-can-wrapper"
              onClick={() =>
                handleDelete("countdown", countdown.id, countdown.imagePath)
              }
            >
              <FaTrash className="trash-can countdown" />{" "}
            </button>
          )}
          <div className="countdown-col">
            <h2>{countdown.title}</h2>
            <CountdownDisplay countdown={countdown} />
            {countdown.events && countdown.events.length > 0 && (
              <ul className="events-list-countdown">
                {countdown.events.map((event, index) => (
                  <li key={index} className="countdown-event-items-container">
                    <div className="event-countdown-title">{event.title}</div>
                    <hr />
                    <div className="flex-center flex-even">
                      <div className="flex-center flex-grow-1 m-0 gap-3">
                        <span>
                          <CiCalendar className="event-logo" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span> - </span>
                        <span className="event-start-end">
                          <CiTimer className="event-logo" />
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                        <span> - </span>
                        <span>
                          <CiLocationOn className="event-logo" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CountdownEvent;
