import { logPageView } from "util/analytics";
import { Deck } from "components/deckCard";

const decks = [
  {
    title: "Algorithms and Design",
    author: "Jonno",
    description: "Algorithm and design flash cards for CSC2023",
    url:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80",
  },
  {
    title: "Operating Systems",
    author: "olly",
    description: "Operating systems module",
    url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  },
  {
    title: "Web Development",
    author: "olly",
    description: "Web development with XHTML",
    url:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  },
];

const about = () => {
  logPageView("/about");
  return (
    <div className="container">
      <h1 className="title">What is Card Collab</h1>
      <p className="subtitle">
        CardCollab is a start up founded by 4 students who were fed up of over
        complated and distracting revision tools online so as a result we came
        together andcreated card collab a minualist revision enviroment
      </p>
      <div className="columns is-multiline">
        {decks.map((card) => (
          <div className="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
            <Deck c={card}></Deck>
          </div>
        ))}
      </div>
    </div>
  );
};

export default about;
