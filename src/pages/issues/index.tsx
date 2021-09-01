import { NextPageContext } from 'next';

const mainPage = '/issues/dashboard';

function Issues() {
  return <div>issues</div>;
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    redirect: {
      destination: mainPage,
      permanent: false,
    },
  };
}

export default Issues;
