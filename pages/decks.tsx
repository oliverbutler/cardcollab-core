// @ts-nocheck
import { logPageView } from "util/analytics";
import Link from "next/link";
import { Deck } from "components/deckCard";

const decks = () => {
  const decks = [
    {
      title: "Algorithms and Design",
      author: "olly",
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
    {
      title: "Mathematics",
      author: "olly",
      description: "Maths with Steggles ♥️",
      url:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
    },
  ];

  logPageView("/decks");
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="title">My Decks</h1>
        <Link href="/create_deck">
          <a style={{ fontSize: "3em" }}>
            <ion-icon name="add-circle-outline"></ion-icon>
          </a>
        </Link>
      </div>
      <div className="content">
        <h3>Latest Decks</h3>
      </div>
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

export default decks;
