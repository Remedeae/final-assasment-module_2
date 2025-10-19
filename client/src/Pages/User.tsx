import { useParams } from "react-router-dom";

function User() {
  const { id } = useParams();
  return (
    <div>
      <h1>User id: {id} </h1>
    </div>
  );
}

export default User;
