import { useContext } from "react";
import { AccountContext } from "context/account";
import { capitalize, parseJwt } from "util/functions";
import { motion } from "framer-motion";
import { logPageView } from "util/analytics";

function ProfileCard({ user }) {
  return (
    <>
      <h1 className="title">Profile</h1>

      <div>
        <figure className="image is-128x128">
          <img
            src={
              user.picture ||
              "https://image.freepik.com/free-vector/man-profile-cartoon_18591-58482.jpg"
            }
            alt="user picture"
          />
        </figure>
        <p>Username: {user.username}</p>
        <p>
          Name:{" "}
          {capitalize(user.givenName) + " " + capitalize(user.familyName)}
        </p>
        <p>Email: {user.email}</p>
      </div>
    </>
  );
}

function Profile() {
  const { state, dispatch } = useContext(AccountContext);

  logPageView("/profile");


  return (
    <div className="container">
      <div className="columns is-centered is-vcentered is-mobile">
        <div className="column is-narrow">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!state.user ? (
              <div>Loading...</div>
            ) : (
                <ProfileCard user={state.user} />
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
