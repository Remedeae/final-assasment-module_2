import { useState } from "react";

function SignUp() {
  const [email, setEmail] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();

  const handleSubmit = () => {
    // post info to player table, await and return the info from the new player, admit to local storage
  };
  return (
    <div>
      <h2>Sign up here</h2>
      <form>
        <label htmlFor="email">E-mail</label>
        <input
          type="text"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button onClick={handleSubmit}>Send to back end + local storage</button>
      </form>
    </div>
  );
}

export default SignUp;
