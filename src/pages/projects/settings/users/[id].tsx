import { useRouter } from 'next/router';
import DetailPageLayout from 'layouts/DetailPageLayout';

function UserDetail() {
  const router = useRouter();

  return <DetailPageLayout>{router.query.id}</DetailPageLayout>;
}

export default UserDetail;
