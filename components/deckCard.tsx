export function Deck(props) {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={props.c.url ? props.c.url : ""}
            alt="Placeholder image"
            height={300}
          />
        </figure>
      </div>
      <div className="card-content">
        <h1 className="title is-4">{props.c.title}</h1>
        <p className="subtitle">
          @{props.c.author}
          <span className="tag is-success is-light"> Admin</span>
        </p>

        <p>{props.c.description}</p>
      </div>
    </div>
  );
}
