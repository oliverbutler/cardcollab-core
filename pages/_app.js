import "../styles/global.scss";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import AppContext from "../context/appContext";
import { useFetchUser } from "../lib/user";
import { useEffect } from "react";
import Head from "next/head";

const initialState = {
  user: null,
  isLoading: true,
};

const reducer = (prevState, action) => {
  console.log(`🟩 Action ▶ ${JSON.stringify(action).substring(0, 200)}...`);

  switch (action.type) {
    case "SET_USER":
      return {
        ...prevState,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...prevState,
        isLoading: action.payload,
      };
    default:
      return prevState;
  }
};

const App = ({ Component, pageProps }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    useFetchUser({ state, dispatch });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <header>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <Navigation />
      </header>
      <Component {...pageProps} />
      <Footer />
    </AppContext.Provider>
  );
};

export default App;
