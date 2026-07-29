import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import FloatingJoinLogo from '@site/src/components/FloatingJoinLogo';

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {pathname} = useLocation();
  const isJoinPage = pathname === '/join' || pathname === '/en/join';
  return (
    <>
      {children}
      {!isJoinPage && <FloatingJoinLogo />}
    </>
  );
}
