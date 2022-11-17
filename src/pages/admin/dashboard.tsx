import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';

import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  useEffect(() => {
    toast('준비중입니다.', {
      icon: '🚧',
    });
  }, []);

  return <>Hello, Dashboard Page.</>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default DashboardPage;
