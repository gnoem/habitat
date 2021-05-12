import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Footer from "../components/Footer";
import { Button } from "../components/Form";

const Home = () => {
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

export default Home;