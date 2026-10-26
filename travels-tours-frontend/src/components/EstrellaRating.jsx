import React from 'react';

function EstrellaRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
}

export default EstrellaRating;