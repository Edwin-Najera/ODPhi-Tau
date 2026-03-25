import { Fragment } from "react";
import type { Countdown } from "./eventData";
import { useInView } from "react-intersection-observer";
import { CiCalendar, CiTimer, CiLocationOn } from "react-icons/ci";
import CountdownDisplay from "../Admin/CountdownFolder/CountdownDisplay";

function CountdownEvent({ countdown }: { countdown: Countdown }) {
  const { ref: countdownRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });

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
    <Fragment>
      <div ref={countdownRef} className="countdown-events-container">
        <div
          className={`countdown-display-container ${visibleElement ? "animate-countdown" : ""}`}
        >
          <img
            src={countdown.imageURL}
            alt="Countdown Image"
            className="countdown-image"
          />
          <div className="countdown-col">
            <h2>{countdown.title}</h2>
            <CountdownDisplay countdown={countdown} />
            {countdown.events && countdown.events.length > 0 && (
              <ul className="events-list-countdown">
                {countdown.events.map((event, index) => (
                  <li key={index} className="countdown-event-items-container">
                    <div className="event-countdown-title">{event.title}</div>
                    <hr />
                    <div className="event-countdown-row">
                      <CiCalendar />
                      <div className="event-countdown-date">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                        <span> - </span>
                        <span className="event-start-end">
                          <CiTimer />
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                        <span> - </span>
                        <span>
                          <CiLocationOn />
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
    </Fragment>
  );
}

export default CountdownEvent;
