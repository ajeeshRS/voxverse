import Articles from "../components/Articles";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import OtherArticles from "../components/OtherArticles";
import PopularArticles from "../components/PopularArticles";
import WelcomeText from "../components/WelcomeText";

function WelcomePage() {
  return (
    <>
      <NavBar />
      <WelcomeText />
      <Articles />
      <PopularArticles />
      <OtherArticles />
      <Footer />
    </>
  );
}

export default WelcomePage;
