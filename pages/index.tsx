import Head from "next/head";
import { motion } from "framer-motion";

const index = () => {
  return (
    <div className="container">
      <Head>
        <title>CardCollab 📚</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img alt="logo" src="logo-full.svg"></img>

      <div className="columns" style={{ alignItems: "center" }}>
        <div className="column is-two-thirds-tablet">
          <h1 id="h" className="title">
            Collaborative Success
          </h1>

          <p>
            Students who utilize flashcards are more likely to succeed in their
            studies, revise faster and more efficiently. <br /> <br />
            Here at CardCollab we aim to develop the most intuitive, powerful,
            and opensource study platform.
            <br />
            By Students, for Students
          </p>
        </div>
        <div className="column">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          >
            <img alt="book image" src="/books.svg"></img>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default index;
