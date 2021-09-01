import { NextPageContext } from 'next';

const mainPage = '/projects/dashboard';

function Projects() {
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

export default Projects;
