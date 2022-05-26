import React, { useEffect, useState } from "react";
import Words from "./Words";
import Players from "./Players";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Round = (props) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="container w-full p-5 roudned mx-auto text-center flex items-start justify-around flex-wrap">
      <div className="round w-full lg:w-4/6 my-2 bg-white min-h-64 shadow p-2">
        <div className="text-center text-gray-700">Round {props.round.id} of {props.round.maxRounds}</div>
        <LazyLoadImage
          afterLoad={() => setIsLoaded(true)}
          beforeLoad={() => setIsLoaded(false)}
          src={`http://localhost:5000/compress?url=${props.round.image}`}
          className="rounded h-80 mx-auto my-3 object-cover"
          onError={e => {
            e.target.src = "https://www.leadershipmartialartsct.com/wp-content/uploads/2017/04/default-image-620x600.jpg"
          }}
        />
        {isLoaded && <Words choices={props.round.choices} socket={props.socket} isLoaded={isLoaded} />}
      </div>
      <Players players={props.round.users} />
    </div>
  );
};

export default Round;
