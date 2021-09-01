import React from 'react';
import ErrorLayout from 'layouts/ErrorLayout';
import { Button, Result } from 'antd';
import { useRouter } from 'next/router';

function NotFound() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.back();
            }}
          >
            Back Home
          </Button>
        }
        css={{ margin: 'auto' }}
      />
    </ErrorLayout>
  );
}

export default NotFound;
