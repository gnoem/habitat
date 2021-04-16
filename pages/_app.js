import "../styles/global.css";
import { Layout } from "../components/Layout";
import { AppContextProvider } from "../contexts";

const App = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  );
}

export default App;