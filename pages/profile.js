import { useContext } from "react";
import AppContext from "../context/appContext";

function ProfileCard({ user }) {
  return (
    <>
      <h1>Profile</h1>

      <div>
        <img src={user.picture} alt="user picture" style={{ width: "20em" }} />
        <p>Nickname: {user.nickname}</p>
        <p>Name: {user.name}</p>
        <p>Email: {JSON.stringify(user)}</p>
      </div>
    </>
  );
}

function Profile() {
  const { state, dispatch } = useContext(AppContext);

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
