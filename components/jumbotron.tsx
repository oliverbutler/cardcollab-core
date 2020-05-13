import styles from "./jumbotron.module.scss";

const Jumbotron = () => {
  return (
    <div className={styles.jumbotron}>
      <img src="/logo-full.svg"></img>
      <p className="m">By Students, for Students</p>
    </div>
  );
};

export default Jumbotron;
