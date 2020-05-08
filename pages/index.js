import Head from "next/head";

import Layout from "../components/layout";
import { useFetchUser } from "../lib/user";

const index = () => {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>CardCollab 📚</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img src="/logo-full.svg" />

      <p className="description">
        Get started by <code>logging in</code> 📚
      </p>

      {loading && <p>Loading login info...</p>}

      {!loading && !user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in{" "}
            <i>Profile</i> and <i>Logout</i>
          </p>
        </>
      )}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          <img src={user.picture} alt="user picture" />
          <p>nickname: {user.nickname}</p>
          <p>name: {user.name}</p>
        </>
      )}
    </Layout>
  );
};

export default index;
