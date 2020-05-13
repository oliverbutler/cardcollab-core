import { useContext } from "react";
import { AccountContext } from "context/account";
import { capitalize } from "util/functions";

function ProfileCard({ user }) {
  return (
    <>
      <h1>Profile</h1>

      <div>
        <img
          src={
            user.picture ||
            "https://image.freepik.com/free-vector/man-profile-cartoon_18591-58482.jpg"
          }
          alt="user picture"
          style={{ width: "20em" }}
        />
        <p>Username: {user.username}</p>
        <p>
          Name:{" "}
          {capitalize(user.given_name) + " " + capitalize(user.family_name)}
        </p>
        <p>Email: {user.email}</p>
      </div>
    </>
  );
}

function Profile() {
  const { state, dispatch } = useContext(AccountContext);

  return (
    <div className="container">
      <main>
        {state.loading || !state.user ? (
          <div>Loading...</div>
        ) : (
          <ProfileCard user={state.user} />
        )}
      </main>
    </div>
  );
}

export default Profile;
