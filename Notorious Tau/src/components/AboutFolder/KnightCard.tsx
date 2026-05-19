import { useState } from "react";
import type { Knights } from "../EventsFolder/eventData";

type Props = {
  knight: Knights;
  index: number;
  hasAwards?: boolean;
};

function KnightCard({ knight, hasAwards = false }: Props) {
  if (hasAwards) {
    const [isFlipped, setIsFlipped] = useState(false);
    const sortedAwards = knight.awards.sort((a, b) => b.year - a.year);

    const groupedAwards = sortedAwards.reduce(
      (acc, award) => {
        const year = award.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(award);
        return acc;
      },
      {} as Record<number, typeof sortedAwards>,
    );

    return (
      <div className="knight-container awards">
        <div
          className="knight-card"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <div className="card-front">
            <div className="image-wrapper">
              <img src={knight.imageURL} alt="knight image" />
            </div>
            <span className="knight-info">{knight.name}</span>
          </div>
          <div className="card-back">
            {Object.entries(groupedAwards).map(([year, awards]) => (
              <div key={year} className="award-year-group">
                <h4 className="award-year">{year}</h4>
                {awards.map((award, index) => (
                  <div
                    key={index}
                    className={`award-item ${isFlipped ? "show" : ""}`}
                    style={
                      {
                        "--delay": `${1000 + index * 300}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <span>{award.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="knight-container">
      <div className="knight-card">
        <div className="image-wrapper">
          <img src={knight.imageURL} alt="knight image" />
        </div>
        <div className="mtb-knight">
          <span className="knight-info name">{knight.name}</span>
          {knight.positions?.map((position) => (
            <span key={position} className="knight-info">
              {position}
            </span>
          ))}
        </div>
        <span className="knight-info number">Knight #{knight.lineNumber}</span>
      </div>
    </div>
  );
}

export default KnightCard;
