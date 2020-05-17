import Link from "next/link";
import { useContext, useState } from "react";
import { AccountContext } from "context/account";
import styles from "./navigation.module.scss";
import { capitalize } from "../util/functions";
import { useRouter } from "next/router";

function Navigation() {
  const { state, dispatch } = useContext(AccountContext);

  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  return (
    <nav
      className="navbar is-transparent "
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link href="/">
          <a>
            <img src="logo.svg" width="50" height="50" />
          </a>
        </Link>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={"navbar-menu " + (isActive ? "is-active" : null)}
      >
        <div className="navbar-start">
          <Link href="/about">
            <a className="navbar-item">About</a>
          </Link>

          <Link href="/browse">
            <a className="navbar-item">Browse</a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!state.user ? (
                <>
                  <Link href="/register">
                    <a className="button is-primary">
                      <strong>Sign up</strong>
                    </a>
                  </Link>
                  <Link href="/login">
                    <a className="button is-light">Log in</a>
                  </Link>
                </>
              ) : router.pathname == "/profile" ? (
                <Link href="/">
                  <a
                    className="button is-primary is-outlined"
                    onClick={() => dispatch({ type: "LOG_OUT" })}
                  >
                    Logout
                  </a>
                </Link>
              ) : (
                <Link href="/profile">
                  <a className="button is-primary">My Profile</a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
