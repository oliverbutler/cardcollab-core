import Link from "next/link";
import { useContext } from "react";
import AppContext from "../context/appContext";
import styles from "./navigation.module.scss";
import { capitalize } from "../lib/functions";
import { useRouter } from "next/router";

function Navigation() {
  const { state, dispatch } = useContext(AppContext);
  const { user, loading } = state;
  const router = useRouter();

  return (
    <nav className={styles.navbar + " m"}>
      <ul>
        <li>
          <Link href="/">
            <a>
              <img id="exclude" src="/logo.svg" alt="CardCollab Logo" />
            </a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
        <li>
          <Link href="/browse">
            <a>Browse</a>
          </Link>
        </li>
        {!loading &&
          (user ? (
            router.pathname === "/profile" ? (
              <li className={styles.logout}>
                <Link href="/api/auth0/logout">
                  <a id="exclude">Logout</a>
                </Link>
              </li>
            ) : (
              <li className={styles.navButton}>
                <Link href="/profile">
                  <a id="exclude">Welcome {capitalize(state.user.nickname)}</a>
                </Link>
              </li>
            )
          ) : (
            <li className={styles.navButton}>
              <a id="exclude" href="/api/auth0/login">Login</a>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navigation;
