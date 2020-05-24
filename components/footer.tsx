import styles from "./footer.module.scss";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Footer = () => {
  return (
    <footer>
      <div className="columns">
        <div className="column">
          <button className="button is-light">Dark Mde</button>
        </div>
        <div className="column">
          <img width="50px" height="50px" alt="logo" src="/logo.svg" />
          <p>Copyright © 2020</p>
        </div>
        <div className="column">
          <div>
            <a href="#">
              <button className="button is-primary">
                <FontAwesomeIcon color="white" icon="coffee" />
              </button>
            </a>
            <a href="#">
              <button className="button is-primary">
                <span className="icon is-small">twitter</span>
              </button>
            </a>
            <a href="#">
              <button className="button is-primary">
                <span className="icon is-small">YT</span>
              </button>
            </a>
            <a href="#">
              <button className="button is-primary">
                <span className="icon is-small">github</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
