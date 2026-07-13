import React from 'react';
import clsx from 'clsx';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CopyButton from '@theme/CodeBlock/Buttons/CopyButton';
import CollapseButton from '@theme/CodeBlock/Buttons/CollapseButton';
import styles from './styles.module.css';

export default function CodeBlockButtons({className}) {
  return (
    <BrowserOnly>
      {() => (
        <div className={clsx(className, styles.buttonGroup)}>
          <CollapseButton />
          <CopyButton />
        </div>
      )}
    </BrowserOnly>
  );
}
