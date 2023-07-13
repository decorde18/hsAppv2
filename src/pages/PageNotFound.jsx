import { styled } from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
// import AppLayout from '../ui/AppLayout';

const Div = styled.div`
  display: grid;
  overflow: auto;
  height: 100vh;
  grid-template-rows: 15rem 1fr auto;
`;
const Div2 = styled.div`
  margin-top: 5rem;
  text-align: center;
  font-weight: 700;
  font-size: x-large;
`;
function PageNotFound() {
  return (
    <Div>
      <Header type="nonApp" />
      <Div2>SORRY THIS PAGE IS NOT FOUND </Div2>
      <Footer />
    </Div>
  );
}

export default PageNotFound;
