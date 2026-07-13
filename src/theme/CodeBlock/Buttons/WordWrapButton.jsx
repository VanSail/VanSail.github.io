import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

export default function WordWrapButton({className}) {
  const {wordWrap} = useCodeBlockContext();
  const canShowButton = wordWrap.isEnabled || wordWrap.isCodeScrollable;
  if (!canShowButton) return false;

  const title = translate({
    id: 'theme.CodeBlock.wordWrapToggle',
    message: 'Toggle word wrap',
    description: 'The title attribute for toggle word wrapping button',
  });

  return (
    <button
      type="button"
      onClick={() => wordWrap.toggle()}
      className={clsx(styles.collapseButton, className)}
      aria-label={title}
      title={title}>
      <svg viewBox="0 0 24 24" style={{width: 16, height: 16, fill: 'none', stroke: '#3b82f6', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
        <path d="M3 8l4 4-4 4M7 12h10M3 16l4-4-4-4M7 20h10" />
      </svg>
    </button>
  );
}
