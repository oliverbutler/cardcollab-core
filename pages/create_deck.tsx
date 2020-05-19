import { useState } from "react";

const create_deck = () => {
  const [title, setTitle] = useState("");

  return (
    <div className="container">
      <h1 className="title">Create a New Deck</h1>
      <form className="is-narrow">
        <div className="field">
          <label className="label">Verify Password</label>
          <div className="control has-icons-left">
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="icon is-small is-left">
              <ion-icon name="document-outline"></ion-icon>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default create_deck;
