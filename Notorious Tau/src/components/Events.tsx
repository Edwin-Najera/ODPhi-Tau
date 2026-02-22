import "./global.css";
import { Fragment } from "react/jsx-runtime";

type Item = {
  name: string;
  price: string;
};
type EventProps = {
  title: string;
  image: string;
  description: string;
  items: Item[];
};

function Events({ title, image, description, items }: EventProps) {
  return (
    <Fragment>
      <div className="card-container">
        <img src={image} className="img-fluid card-event" alt="Event" />
        <div>
          {/* We will ask the user the event title and the description such that it will be displayed here */}
          <div className="card-text">
            <h1 id="event-title">{title}</h1>
            <div>
              <p>{description}</p>
              <br />
              <br />
              <h5>Prices below</h5>
              <br />
              <br />
              {/* We will ask the user which items will be sold and the prices at which they are sold
              This will update as the user adds it */}
              <div id="event-prices">
                <ul id="sell-items">
                  {items.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Events;
