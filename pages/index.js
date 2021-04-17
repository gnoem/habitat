import { Footer } from "../components/Footer";
import { Button } from "../components/Form";
import Homepage from "../components/Homepage";

export default function Home() {
  return (
    <Homepage>
      <p>habitat is a web app designed & created by <a href="https://ngw.dev/">naomi g.w.</a> as a project for her portfolio and also as a personal tool to track her habits / hopefully organize her life. feel free to use this, if you want.</p>
      <nav>
        <Button href="/login">Login</Button>
        <Button href="/register">Register</Button>
      </nav>
      <Footer>copyright 2021 naomi g.w. • all rights reserved</Footer>
    </Homepage>
  );
}
