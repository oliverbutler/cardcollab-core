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
          <script
            src="https://kit.fontawesome.com/d3739899ee.js"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <Navigation />
        <div className="section">
          <Component />
        </div>
        <Footer />
      </Wrapper>
    </AccountProvider>
  );
};

export default App;
