import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <img src="/logo.svg" />
      <p>Copyright © 2020</p>
    </footer>
  );
};

export default Footer;
