import styles from "./footer.module.scss";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Footer = () => {
  const [mode, setMode] = useState(true);

  return (
    <footer className={styles.Footer}>
      <div className="columns footer">
        <div className="column">
          <Switch mode={mode} setMode={setMode} />
        </div>
        <div className="column">
          <img width="50px" height="50px" alt="logo" src="/logo.svg" />
          <p>Copyright © 2020</p>
        </div>
        <div className="column">
          <button className="button is-primary">
            <ion-icon name="logo-facebook"></ion-icon>
          </button>

          <button className="button is-primary">
            <ion-icon name="logo-twitter"></ion-icon>
          </button>

          <button className="button is-primary">
            <ion-icon name="logo-instagram"></ion-icon>
          </button>

          <button className="button is-primary">
            <ion-icon name="logo-github"></ion-icon>
          </button>
        </div>
      </div>
    </footer>
  );
};

const Switch = (prop) => {
  if (prop.mode) {
    return (
      <button
        className="button is-dark"
        onClick={() => {
          prop.setMode(false);
          document.body.classList.add("dm");
        }}
      >
        Dark Mode
      </button>
    );
  } else {
    return (
      <button
        className="button is-light"
        onClick={() => {
          prop.setMode(true);
          document.body.classList.remove("dm");
        }}
      >
        Light Mode
      </button>
    );
  }
};

export default Footer;
