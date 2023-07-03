import styles from './AppLayout.module.css';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainSection from '../components/MainSection';
import Loader from '../ui/Loader';
import { useNavigation } from 'react-router-dom';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="grid h-screen  grid-rows-[auto_1fr_auto] overflow-auto">
      {/* {isLoading && <Loader />} */}

      <Header />
      <main className="flex">
        <SideBar></SideBar>
        <MainSection></MainSection>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
