//import { useEffect} from "react";
import { useState } from "react";
import { createApiFetch } from "../stores/apiFetchStore";
import { useNavigate, useParams } from "react-router-dom";
import type { SessionSchema } from "../types/tableTypes";

const usePostSession = createApiFetch();

function Timer() {
  const { id } = useParams();
  const placeholderUserId = 1;
  const userId = placeholderUserId;

  const navigate = useNavigate();

  //const [timePlayed, setTimePlayed] = useState(0);
  const [timerStatus, setTimerStatus] = useState(true);
  const [timerStatusMsg, setTimerStatusMsg] = useState("STOP");

  //const session = usePostSession((state) => state.data as SessionSchema | null); //here we call the type of data
  const error = usePostSession((state) => state.error);
  const postSession = usePostSession((state) => state.apiFetchAsync);

  /*   useEffect(() => {
    let i: number;
    if (timerStatus) {
      i = setInterval(() => {
        setTimePlayed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(i);
  }, [timerStatus]); */
  const handleTimerStatus = () => {
    if (timerStatus) {
      setTimerStatus(false);
      setTimerStatusMsg("START");
    } else {
      setTimerStatus(true);
      setTimerStatusMsg("STOP");
    }
  };

  const handlePostSession = async () => {
    handleTimerStatus();
    const newSession = await postSession<SessionSchema>("post", `game/${id}`, {
      userId: { userId },
      gameId: id,
      //  minutes: timePlayed,
    });
    if (!newSession) {
      return;
    }
    console.log(newSession);
    return navigate("/games");
  };
  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  return (
    <div className="timer">
      <div>
        <h2>Minutes played:</h2>
        {/*         <h2>{timePlayed}</h2> */}
      </div>
      <button onClick={handleTimerStatus}>{timerStatusMsg}</button>
      <button onClick={handlePostSession}>Save and Exit</button>
    </div>
  );
}

export default Timer;
