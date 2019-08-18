import React from "react";

function CardRating({ rating }) {
   const stars = [];
   for (let i = 0; i < rating; i++) {
      stars.push(<span className="fa fa-star checked" key={`checked${i}`} />);
   }
   for (let j = 0; j < 5 - rating; j++) {
      stars.push(<span className="fa fa-star" key={`unchecked${j}`} />);
   }
   return <div className="card-rating">{stars}</div>;
}
export default CardRating;
