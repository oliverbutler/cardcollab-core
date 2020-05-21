import { useState } from "react";
import Input, { InputType } from "components/input";
import { motion } from "framer-motion";
import Link from "next/link";

const create_deck = () => {
  const subjects = [
    { title: "Arts and Humanities", name: "arts_and_humanities" },
    { title: "Languages", name: "languages" },
    { title: "Maths", name: "maths" },
    { title: "Science", name: "science" },
    { title: "Social Sciences", name: "social_sciences" },
  ];

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="title">Subjects</h1>
        <button className="button is-info">Add yours</button>
      </div>
      <ul>
        {subjects.map((subject) => (
          <li>
            <Link href={"/subject/" + subject.name}>
              <a>{subject.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default create_deck;
