import "../styles/global.scss";
import Footer from "../components/footer";
import "react-quill/dist/quill.snow.css";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;
