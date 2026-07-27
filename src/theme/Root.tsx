import type {ReactNode} from 'react';
import FloatingToolbar from '@site/src/components/FloatingToolbar';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <FloatingToolbar />
    </>
  );
}
