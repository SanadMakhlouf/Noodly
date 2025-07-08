import React from "react";
import "../styles/Story.css";

function Story() {
  return (
    <section className="story">
      <div className="container">
        <h2 className="story-title">THE DELICIOUS STORY</h2>
        <p className="story-text">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, It is a long established fact that a reader will be
          distracted by the readable content of a page when looking at its
          layout. The point of using Lorem.
        </p>
        <div className="story-buttons">
          <button className="btn-primaryy">READ MORE</button>
          <button className="btn-primaryy">BOOK NOW</button>
        </div>
      </div>
    </section>
  );
}

export default Story;
