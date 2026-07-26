import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Original from '@theme-original/DocItem/Content';
import DocMindMap from '../../DocMindMap';

export default function Content(props: any) {
  const {toc, contentTitle, frontMatter} = useDoc();
  const fm = frontMatter as Record<string, unknown>;
  const enabled = fm?.mindmap === true;
  const direction = fm?.mindmap_direction === 'both' ? 'both' : 'right';
  const size = typeof fm?.mindmap_size === 'number' ? fm.mindmap_size : 100;
  const title = contentTitle || (frontMatter?.title as string) || '';

  return (
    <>
      {enabled && (
        <DocMindMap toc={toc} title={title} direction={direction} size={size} />
      )}
      <Original {...props} />
    </>
  );
}
