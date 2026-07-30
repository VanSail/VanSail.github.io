import type {ReactElement} from 'react';
import styles from './styles.module.css';

/**
 * 首页分隔线：地球动画与下方内容之间的一根装饰线。
 * 居中的品牌橙渐变细线，两端淡出、中心一颗发光点，无文字，
 * 呼应「扬帆」品牌与导航/页脚的点缀风格。
 */
export default function Divider(): ReactElement {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.dot} />
    </div>
  );
}
