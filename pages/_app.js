import "../styles/global.scss";
import Footer from "../components/footer";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;
