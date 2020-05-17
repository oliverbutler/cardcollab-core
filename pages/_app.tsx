import "styles/global.scss";
import Footer from "components/footer";
import Navigation from "components/navigation";
import Head from "next/head";
import React from "react";
import AccountProvider from "context/account";
import Wrapper from "components/wrapper";

const App = ({ Component, pageProps }) => {
  return (
    <AccountProvider>
      <Wrapper>
        <header>
          <Head>
            <link
              href="https://fonts.googleapis.com/css?family=Montserrat"
              rel="stylesheet"
              type="text/css"
            />
            <meta name="CardCollab is a revolutionary new way to collaborate with friends to create flashcards and notes"></meta>
          </Head>
          <Navigation />
          <Component />
        </header>
        <Footer />
      </Wrapper>
    </AccountProvider>
  );
};

export default App;
