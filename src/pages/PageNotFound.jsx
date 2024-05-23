import { styled } from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/Header';
import BackButton from '../ui/BackButton';

const Div = styled.div`
  display: grid;
  overflow: auto;
  height: 100dvh;
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
      <Div2>
        SORRY THIS PAGE IS NOT FOUND
        <div>
          <BackButton />
        </div>
      </Div2>
      <Footer />
    </Div>
  );
}

export default PageNotFound;
