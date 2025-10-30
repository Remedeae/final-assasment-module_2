import { useState } from "react";
import { createApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/globalStore";

const usePostNewUser = createApiFetch();

function SignUp() {
  const navigate = useNavigate();
  const setActiveUser = useUserStore((state) => state.setActiveUser);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  //const user = usePostNewUser((state) => state.data as UserSchema | null);
  const error = usePostNewUser((state) => state.error);
  const postNewUser = usePostNewUser((state) => state.apiFetchAsync);

  const handleSubmit = async () => {
    try {
      const response = await postNewUser<{ message: string; user: UserSchema }>(
        "post",
        "signup",
        {
          email: email?.toLocaleLowerCase(),
          firstName: firstName,
          lastName: lastName,
        }
      );
      const newUser = response?.user;
      //console.log(newUser);
      if (newUser) {
        setActiveUser(newUser);
        localStorage.setItem("activeUser", JSON.stringify(newUser));
        navigate(`/user/${newUser.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="signUp">
      {error && <h2>{error}</h2>}
      <h2>Sign up here</h2>
      <div>
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          id="firstName"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="text"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default SignUp;
