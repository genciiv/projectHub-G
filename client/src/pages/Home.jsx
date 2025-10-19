// client/src/pages/Home.jsx
export default function Home() {
  return (
    <div className="container">
      <div className="card card--hoverable">
        <h2 className="card__title">ProjectHub</h2>
        <p className="muted">Posto projekte, apliko dhe fito. Dizajn i ri ✨</p>
        <div className="row" style={{ marginTop: ".8rem" }}>
          <a className="btn" href="/projects">
            Shfleto projektet
          </a>
          <a className="btn btn--outline" href="/post-project">
            Posto projekt
          </a>
        </div>
      </div>
    </div>
  );
}
