import Head from "next/head";
import AppContext from "../context/appContext";
import { useContext, useEffect } from "react";
import Jumbotron from "../components/jumbotron";
import styles from "../styles/index.module.scss";

const index = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className="container">
      <Head>
        <title>CardCollab 📚</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Jumbotron />

      <main>
        <div className={styles.infoWithPicture}>
          <div>
            <h1>Collaborative Success</h1>
            <p>
              Students who utilize flashcards are more likely to succeed in
              their studies, revise faster and more efficiently. <br /> <br />
              Here at CardCollab we aim to develop the most intuitive, powerful,
              and opensource study platform.
              <br />
              By Students, for Students
            </p>
          </div>
          <img src="/books.svg"></img>
        </div>
      </main>
    </div>
  );
};

export default index;
