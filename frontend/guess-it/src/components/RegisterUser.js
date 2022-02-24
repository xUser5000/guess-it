import React, { useState } from "react";
import RegisterInput from "./RegisterInput";

const RegisterUser = (props) => {
  const [isMatched, setIsMatched] = useState(false);
  const [isEqueued, setIsEnqueued] = useState(false);
  const [error, setError] = useState("");



  return (
    <div className="RegisterUser bg-white p-5 container lg:w-3/4 mx-auto shadow rounded">
      <h1 className="font-bold my-2 text-3xl">Guess it</h1>
      <div
        className="
            username-group
            mx-auto
            flex
            items-center
            justify-around
            flex-wrap
          "
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.socket.emit("enqueue", props.username);
            props.socket.on("in_queue", () => {
              console.log(props.username + " is enqueed");
              setIsEnqueued(true);
              setError("");
            });

            props.socket.on("matched", () => {
              setIsMatched(true);
              setIsEnqueued(false);
              props.socket.emit("ready");
              props.setIsRoundReady(true);
              setError("");
            });

            props.socket.on("error", (msg) => setError(msg));
          }}
        >
          {isMatched && (
            <div className="p-3 bg-green-300 m-3 font-lg">Mathced</div>
          )}
          {isEqueued && (
            <div className="p-3 bg-yellow-300 m-3 font-lg">Enqueued</div>
          )}
          {error && <div className="p-3 bg-red-300 m-3 font-lg"> {error} </div>}
          {(!isEqueued && !isMatched && (
            <RegisterInput setUsername={props.setUsername} />
          )) ||
            "waiting"}
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
