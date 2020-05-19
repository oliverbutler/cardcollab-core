import Link from "next/link";
import { useContext, useState, useRef, useEffect } from "react";
import { AccountContext } from "context/account";
import { capitalize } from "../util/functions";
import { useRouter } from "next/router";
import MenuToggle from "components/menuToggle";
import { motion } from "framer-motion";
// import useWindowDimensions from "util/useWindowDimension";

function Navigation() {
  const { state, dispatch } = useContext(AccountContext);
  // const { height, width } = useWindowDimensions();
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  const wrapperRef = useRef(null);

  useEffect(() => {
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
      className={"navigation " + (isActive ? "active" : "")}
      ref={wrapperRef}
    >
      <div className="navigation-top">
        <div className="navigation-brand">
          <Link href="/">
            <a onClick={() => setIsActive(false)}>
              <img alt="brand logo" src="logo.svg" />
            </a>
          </Link>
        </div>
        <div className="navigation-menu">
          <a onClick={() => setIsActive(!isActive)}>
            <MenuToggle isActive={isActive} />
          </a>
        </div>
      </div>

      <motion.div
        className="navigation-motion"
        // initial={{ opacity: 0 }}
        animate={{
          height: isActive ? "auto" : 0,
          // opacity: isActive ? 1 : width < 760 ? 0 : 1,
        }}
        // transition={{ delay: width < 769 ? 0 : 0.1 }}
      >
        <div className="left">
          <Link href="/about">
            <a className="navbar-item" onClick={() => setIsActive(!isActive)}>
              About
            </a>
          </Link>

          <Link href="/browse">
            <a className="navbar-item" onClick={() => setIsActive(false)}>
              Browse
            </a>
          </Link>
          {state.user ? (
            <Link href="/decks">
              <a className="navbar-item" onClick={() => setIsActive(false)}>
                My Decks
              </a>
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="right">
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
      </motion.div>
    </nav>
  );
}

export default Navigation;
