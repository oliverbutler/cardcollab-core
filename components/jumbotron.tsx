import styles from "./jumbotron.module.scss";

const Jumbotron = () => {
  return (
    <div className={styles.jumbotron}>
      <img alt= "logo jumbotron" src="/logo-full.svg"></img>
      <p className="m">By Students, for Students</p>
    </div>
  );
};

export default Jumbotron;
