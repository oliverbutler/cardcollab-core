import styles from "./deckCard.module.scss";

export function Deck(props) {
  return (
    <div className={styles.deckCard}>
      <div className="card" style={{ height: "100%" }}>
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src={props.c.url ? props.c.url : ""}
              alt="Placeholder image"
              height={300}
            />
          </figure>
          <figure className="profile image is-96x96">
            <img className="is-rounded" src={profilepic()} />
          </figure>
        </div>
        <div className="card-content">
          <div className="columns">
            <div className="column is-one-third">
              <p>
                @{props.c.author}
                <span className={typeclass(props.c.userType)}>
                  {props.c.userType}
                </span>
              </p>
            </div>
            <div className="column">
              <h1 className="title is-4">{props.c.title}</h1>
            </div>
          </div>

          <p>{props.c.description}</p>
        </div>
      </div>
    </div>
  );
}
function typeclass(val) {
  console.log(val);
  if (val == "Admin") {
    return "tag is-warning is-light";
  } else if (val == "Pro") {
    return "tag is-success is-light";
  } else {
    return "tag  is-light is-light";
  }
}

function profilepic() {
  var num = Math.round(Math.random() * 100);
  return "https://randomuser.me/api/portraits/men/" + num + ".jpg";
}
