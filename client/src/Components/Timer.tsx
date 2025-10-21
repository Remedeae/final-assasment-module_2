//This component is still under construction, it does not work
import { useState } from "react";

function Timer() {
  const [timePlayed, setTimePlayed] = useState(0);
  let stopTimer = false;
  const timer = () => {
    do {
      setTimeout(1000);
      let i = timePlayed;
      setTimePlayed(i);
      i++;
    } while (stopTimer === false);
  };

  return (
    <div className="timer">
      <div>
        <h2>Score</h2>
        <h2>{timePlayed}</h2>
      </div>
      <button>STOP</button>
    </div>
  );
}

export default Timer;
