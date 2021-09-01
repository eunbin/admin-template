import { NextPageContext } from 'next';

const mainPage = '/projects/settings/ag-grid';

function Settings() {
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

export default Settings;
