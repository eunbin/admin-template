import { NextPageContext } from 'next';

const mainPage = '/projects';

function Home() {
  return <div>home</div>;
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    redirect: {
      destination: mainPage,
      permanent: false,
    },
  };
}

export default Home;
