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
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat"
            rel="stylesheet"
            type="text/css"
          />
          <meta name="CardCollab is a revolutionary new way to collaborate with friends to create flashcards and notes"></meta>
        </Head>
        <Navigation />
        <div className="section">
          <Component />
        </div>
        <Footer />
        <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
      </Wrapper>
    </AccountProvider>
  );
};

export default App;
