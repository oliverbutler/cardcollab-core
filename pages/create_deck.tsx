import { useState } from "react";
import Input, { InputType } from "components/input";
import { motion } from "framer-motion";

const create_deck = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [module, setModule] = useState("");
  const [file, setFile] = useState();

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered is-mobile">
        <div className="column is-narrow">
          <h1 className="title" style={{}}>
            Create a New Deck
          </h1>
          <form>
            <Input
              type={InputType.TEXT}
              onChange={setTitle}
              value={title}
              title="Title"
              iconLeft="albums-outline"
            ></Input>
            <Input
              type={InputType.TEXT}
              onChange={setDescription}
              value={description}
              title="Description"
              iconLeft="ellipsis-horizontal-outline"
            ></Input>
            <Input
              type={InputType.TEXT}
              onChange={setSubject}
              value={subject}
              title="Subject"
              iconLeft="calculator-outline"
            ></Input>
            <Input
              type={InputType.TEXT}
              onChange={setModule}
              value={module}
              title="Module"
              iconLeft="school-outline"
            ></Input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default create_deck;
