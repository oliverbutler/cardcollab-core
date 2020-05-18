import Link from "next/link";
import { useContext, useState, useRef, useEffect } from "react";
import { AccountContext } from "context/account";
import styles from "./navigation.module.scss";
import { capitalize } from "../util/functions";
import { useRouter } from "next/router";

function useOutsideAlerter(ref) {}

function Navigation() {
  const { state, dispatch } = useContext(AccountContext);

  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  const wrapperRef = useRef(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <nav
      className="navbar is-transparent "
      role="navigation"
      aria-label="main navigation"
      ref={wrapperRef}
    >
      <div className="navbar-brand">
        <Link href="/">
          <a onClick={() => setIsActive(false)}>
            <img alt="brand logo" src="logo.svg" width="50" height="50" />
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

      <div className={"navbar-menu " + (isActive ? "is-active" : "")}>
        <div className="navbar-start">
          <Link href="/about">
            <a className="navbar-item" onClick={() => setIsActive(false)}>
              About
            </a>
          </Link>

          <Link href="/browse">
            <a className="navbar-item" onClick={() => setIsActive(false)}>
              Browse
            </a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!state.user ? (
                <>
                  <Link href="/register">
                    <a
                      className="button is-primary"
                      onClick={() => setIsActive(false)}
                    >
                      <strong>Sign up</strong>
                    </a>
                  </Link>
                  <Link href="/login">
                    <a
                      className="button is-light"
                      onClick={() => setIsActive(false)}
                    >
                      Log in
                    </a>
                  </Link>
                </>
              ) : router.pathname == "/profile" ? (
                <Link href="/">
                  <a
                    className="button is-primary is-outlined"
                    onClick={() => {
                      dispatch({ type: "LOG_OUT" });
                      setIsActive(false);
                    }}
                  >
                    Logout
                  </a>
                </Link>
              ) : (
                <Link href="/profile">
                  <a
                    className="button is-primary"
                    onClick={() => setIsActive(false)}
                  >
                    My Profile
                  </a>
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
