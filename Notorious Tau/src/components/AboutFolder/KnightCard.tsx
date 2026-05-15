import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import type { Knights } from "../EventsFolder/eventData";

type Props = {
  knight: Knights;
  index: number;
  hasAwards?: boolean;
};

function KnightCard({ knight, index, hasAwards = false }: Props) {
  const { ref: myRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });

  const cardClass = `knight-card ${visibleElement ? "show" : ""}`;

  if (hasAwards) {
    return (
      <div ref={myRef} className={cardClass}>
        <div>
          <span>{knight.name}</span>
          {knight.awards.map((award, index) => (
            <Fragment key={index}>
              <span>{award.title}</span>
              <span>{award.year}</span>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      ref={myRef}
      className={cardClass}
      style={{ animationDelay: `${index * 250}ms` }}
    >
      <span className="knight-info">{knight.position}</span>
      <div className="image-wrapper">
        <img src={knight.imageURL} alt="knight image" />
      </div>
      <div className="mtb-knight">
        <span className="knight-info name">{knight.name}</span>
        <span className="knight-info">Knight #{knight.lineNumber}</span>
      </div>
    </div>
  );
}

export default KnightCard;
