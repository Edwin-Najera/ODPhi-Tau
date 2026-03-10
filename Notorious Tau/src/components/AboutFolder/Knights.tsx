import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import type { Knights, Awards } from "../EventsFolder/eventData";

type Props = {
  knight: Knights;
  index: number;
  hasAwards?: boolean;
};

function KnightCards({ knight, index, hasAwards = false }: Props) {
  const { ref: myRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });
  let card = "knight-card";

  if (visibleElement) {
    card = "knight-card show";
  }

  if (hasAwards) {
    return (
      <Fragment>
        <div ref={myRef} className={card}>
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
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div
        ref={myRef}
        className={card}
        style={{ animationDelay: `${index * 250}ms` }}
      >
        <div className="image-wrapper">
          <img src={knight.imageURL} alt="knightutive" />
        </div>
        <div className="mtb-knight">
          <span className="knight-name">{knight.name}</span>
          <span className="knight-line-number">
            Knight #{knight.lineNumber}
          </span>
        </div>
      </div>
    </Fragment>
  );
}

export default KnightCards;
