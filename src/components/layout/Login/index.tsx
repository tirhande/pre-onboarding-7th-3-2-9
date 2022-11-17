import React from 'react';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import Login from './Login';

const LoginIndex = () => {
  const router = useRouter();

  const onSubmit = async (values: { email: string; password: string }) => {
    const response = await signIn('user-credential', {
      ...values,
      redirect: false,
      callbackUrl: `${window.location.origin}/admin/accounts`,
    });

    if (response.ok) {
      const myPromise = router.push(response.url);
      toast.promise(myPromise, {
        loading: '로그인중...',
        success: '로그인 성공!',
        error: '로그인 실패',
      });
    } else {
      toast.error('이메일 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <>
      <Login onSubmit={onSubmit} />
      <Copyright>Copyright © December and Company Inc.</Copyright>
      <ResponsiveLabel>
        본 사이트는 1920 X 1080 해상도 PC 사용에 최적화 되어 있습니다.
      </ResponsiveLabel>
    </>
  );
};

const Copyright = styled.p`
  font-size: 12px;
  color: #767676;
  text-align: center;
  margin-top: 1.8rem;
`;
const ResponsiveLabel = styled.p`
  font-size: 12px;
  color: #767676;
  text-align: center;
  margin-top: 1.8rem;

  @media screen and (min-width: 800px) {
    display: none;
  }
`;

export default LoginIndex;
