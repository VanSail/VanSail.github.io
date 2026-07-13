import React from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Title from '@theme/CodeBlock/Title';
import Content from '@theme/CodeBlock/Content';
import Buttons from '@theme/CodeBlock/Buttons';
import styles from './styles.module.css';

export default function CodeBlockLayout({className}) {
  const {metadata} = useCodeBlockContext();

  return (
    <Container as="div" className={clsx(className, metadata.className, styles.card)}>
      <div className={styles.toolbar}>
        <div className={styles.tab}>
          {metadata.title ? <Title>{metadata.title}</Title> : '代码块标题'}
        </div>
        <Buttons />
      </div>
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <Content />
        </div>
      </div>
    </Container>
  );
}
