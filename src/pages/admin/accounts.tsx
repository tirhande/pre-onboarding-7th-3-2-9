import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { dehydrate, QueryClient } from '@tanstack/react-query';

import AccountIndex from 'components/layout/Admin/Accounts';
import AxiosRequest from 'core/services';
import { getToken } from 'next-auth/jwt';

const AccountsPage = () => {
  return <AccountIndex />;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const queryClient = new QueryClient();
  const session = await getSession(context);
  const expires = new Date(session.expires);
  if (new Date() > expires) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const token = await getToken(context);
  if (token) {
    const { broker = '', active = '', status = '', q = '', ...pages } = context.query;
    const page = pages.page ? +pages.page : 1;
    const limit = pages.limit ? +pages.limit : 10;

    await Promise.all([
      queryClient.prefetchQuery(['users'], async () => {
        try {
          const { headers, data } = await AxiosRequest.get('/users', {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });
          const mergedData = {
            totalCount: headers['x-total-count'] || 0,
            data: data,
          };
          return mergedData;
        } catch (e) {
          return e.data;
        }
      }),
      queryClient.prefetchQuery(['accounts', page, limit, broker, active, status, q], async () => {
        try {
          const { headers, data } = await AxiosRequest.get('/accounts', {
            headers: { Authorization: `Bearer ${token.accessToken}` },
            params: {
              _page: page,
              _limit: limit,
              broker_id_like: broker,
              is_active_like: active,
              status_like: status,
              q: q,
            },
          });
          const mergedData = {
            totalCount: headers['x-total-count'] || 0,
            data: data,
          };
          return mergedData;
        } catch (e) {
          return e.data;
        }
      }),
    ]);
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
export default AccountsPage;
