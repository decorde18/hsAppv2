import Footer from '../components/Footer';
import Header from '../components/Header';
import styles from './Homepage.module.css';

function Homepage() {
  //TODO create a PageNav page (if we want from the top)
  return (
    <div className="grid h-screen grid-rows-[9rem_1fr_auto]">
      <Header />
      <main>
        This is the main section. It will include all things on the landing
        page. This page is before you are logged in
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;
