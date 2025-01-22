import React from "react";
import Slider from "react-slick";

import "../styles/components/tutorial.scss";

function Tutorial() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="tutorial">
      <h2>Gist of the Game</h2>
      <Slider {...settings}>
        <div>
          <h3>You're given random words at the start:</h3>
          <img src="/slide1.png" alt="slide1" />
        </div>
        <div>
          <h3>You try to write a word you think others will guess as well:</h3>
          <img src="/slide2.png" alt="slide2" />
        </div>
        <div>
          <h3>Someone else guesses another word, you will have to keep trying</h3>
          <img src="/slide3.png" alt="slide3" />
        </div>
        <div>
          <img src="/slide4.png" alt="slide4" />
        </div>
      </Slider>
    </div>
  );
}

export default Tutorial;
