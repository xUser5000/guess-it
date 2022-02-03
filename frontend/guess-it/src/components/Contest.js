import React, { useState, useEffect } from "react";
import Round from "./round/Round";

const Contest = (props) => {
  let [round, setRound] = useState({});
  const [isRoundReady, setIsRoundReady] = useState(false);
 
  useEffect(() => {
    props.socket.on("round", (newRound) => {
      let testRound = {
        id: newRound.id,
        image: newRound.image,
        choices: newRound.choices,
        users: newRound.users,
        maxRounds: newRound.maxRounds
      };
      setRound({
        ...round,
        ...testRound,
      });
      setIsRoundReady(true);
    });
  }, []);
  return (
    <div>{isRoundReady && <Round round={round}  socket={props.socket} />}</div>
  );
};

export default Contest;
