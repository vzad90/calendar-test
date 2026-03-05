import styled from '@emotion/styled';
import { Calendar } from './components/Calendar/Calendar';

const Page = styled.div`
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Page>
      <Main>
        <Calendar />
      </Main>
    </Page>
  );
}

export default App;
