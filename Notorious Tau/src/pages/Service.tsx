import { useState, useEffect } from "react";
import type { Event } from "../components/EventsFolder/eventData";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../components/Admin/firebase";
import Loading from "../components/Loading";

function Service() {
  const [loading, setLoading] = useState(true);
  const [serviceEvents, setServiceEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchServiceEvents = async () => {
      try {
        const q = query(
          collection(db, "service"),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);

        const eventsData: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        setServiceEvents(eventsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceEvents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="service-page">
      <h2>Service Highlights</h2>
      <div className="line-separate" style={{ padding: 0 }} />
      <div className="service-event-wrapper">
        {serviceEvents.map((service) => (
          <div key={service.id} className="service-event">
            <h3 className="service-title">{service.eventTitle}</h3>
            <img
              src={service.imageURL}
              alt="Service Event"
              className="service-img"
            />
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
