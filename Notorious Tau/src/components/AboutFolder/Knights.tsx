import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import type { Knights } from "../EventsFolder/eventData";

type Props = {
  knight: Knights;
  index: number;
  hasAwards?: boolean;
};

function KnightCards({ knight, index, hasAwards = false }: Props) {
  const { ref: myRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });

  const cardClass = `knight-card${visibleElement ? "show" : ""}`;

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
      <div className="image-wrapper">
        <img src={knight.imageURL} alt="knight image" />
      </div>
      <div className="mtb-knight">
        <span className="knight-name">{knight.name}</span>
        <span className="knight-line-number">Knight #{knight.lineNumber}</span>
      </div>
    </div>
  );
}

export default KnightCards;
