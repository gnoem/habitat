import { useContext, useEffect } from "react";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ModalContext } from "../contexts";
import { getQueryParams } from "../utils";
import Footer from "../components/Footer";
import { Button } from "../components/Form";

const Home = ({ query }) => {
  const { createModal } = useContext(ModalContext);
  useEffect(() => {
    const { demo } = query;
    if (demo == null) return;
    createModal('demoMessage');
  }, []);
  return (
    <>
      <p>habitat is a web app designed & created by <a href="https://ngw.dev/" target="_blank">naomi g.w.</a> as a project for her portfolio and also as a personal tool to organize her life!</p>
      <nav>
        <Button href="/login">Login</Button>
        <Button href="/register">Register</Button>
      </nav>
      <p>&raquo; <i>read more about this project on <a href="https://github.com/gnoem/habitat" target="_blank">github <FontAwesomeIcon icon={faGithub} /></a></i></p>
      <Footer>copyright 2021 naomi g.w. • all rights reserved</Footer>
    </>
  );
}

Home.getInitialProps = getQueryParams;

export default Home;