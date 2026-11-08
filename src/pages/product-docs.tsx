import type {ReactNode} from 'react';
import SectionPlaceholder from '@site/src/components/SectionPlaceholder';

/**
 * 导航栏「产品文档」的落点：随产品上线同步开放。
 * 不指向 /docs —— 那是文档语法写作教程，入口在首页「文档语法」按钮。
 */
export default function ProductDocs(): ReactNode {
  return <SectionPlaceholder section="productDocs" />;
}
