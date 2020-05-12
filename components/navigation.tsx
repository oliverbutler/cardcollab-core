import Link from "next/link";
import { useContext } from "react";
import { AccountContext } from "context/account";
import styles from "./navigation.module.scss";
import { capitalize } from "../util/functions";
import { useRouter } from "next/router";

function Navigation() {
  const { state, dispatch } = useContext(AccountContext);
  const { user, loading } = state;

  const router = useRouter();

  return (
    <nav className={styles.navbar + " m"}>
      <ul>
        <li>
          <Link href="/">
            <a>
              <img src="/logo.svg" alt="CardCollab Logo" />
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
                <Link href="/">
                  <a onClick={() => dispatch({ type: "LOG_OUT" })}>Logout</a>
                </Link>
              </li>
            ) : (
              <li className={styles.navButton}>
                <Link href="/profile">
                  <a>Welcome {capitalize(state.user.given_name)}</a>
                </Link>
              </li>
            )
          ) : router.pathname === "/login" ? (
            <></>
          ) : (
            <li className={styles.navButton}>
              <Link href="login">
                <a>Login</a>
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navigation;
