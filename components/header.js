import Link from "next/link";

function Header({ user, loading }) {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {!loading &&
            (user ? (
              <>
                <li>
                  <Link href="/profile">
                    <a>Client-rendered profile</a>
                  </Link>
                </li>
                <li>
                  <a href="/api/auth0/logout">Logout</a>
                </li>
              </>
            ) : (
              <li>
                <a href="/api/auth0/login">Login</a>
              </li>
            ))}
        </ul>
      </nav>

      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #070707;
        }
        nav {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
        img {
          height: 100%;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-child(1) {
          margin-right: auto;
        }
        a {
          color: #070707;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #070707;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  );
}

export default Header;
