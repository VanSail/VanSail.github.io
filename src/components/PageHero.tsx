import type {ReactNode} from 'react';
import styles from './PageHero.module.css';

type HeroType = 'ai' | 'robots' | 'embedded';

interface Props {
  type: HeroType;
}

export default function PageHero({type}: Props): ReactNode {
  return (
    <div className={styles.heroArea}>
      <div className={styles.character}>
        {type === 'ai' && <AiOrb />}
        {type === 'robots' && <RoboGuard />}
        {type === 'embedded' && <SmartChip />}
      </div>
    </div>
  );
}

/* ---- 共享人脸: 眼睛 + 微笑 ---- */
function Face({
  eyeClass = '',
  smileClass = '',
}: {
  eyeClass?: string;
  smileClass?: string;
}) {
  return (
    <>
      <div className={`${styles.faceEyes} ${eyeClass}`}>
        <div className={styles.faceEye}>
          <div className={styles.facePupil} />
        </div>
        <div className={styles.faceEye}>
          <div className={styles.facePupil} />
        </div>
      </div>
      <div className={`${styles.faceSmile} ${smileClass}`} />
    </>
  );
}

/* ---- 1. 人工智能 - 神经光球 ---- */
function AiOrb() {
  return (
    <div className={styles.aiOrb}>
      <div className={styles.aiOrbRing} />
      <div className={styles.aiOrbRing2} />
      <div className={styles.aiOrbInner}>
        <Face />
      </div>
      <div className={styles.aiOrbDot} />
      <div className={styles.aiOrbDot} />
      <div className={styles.aiOrbDot} />
    </div>
  );
}

/* ---- 2. 机器人 - 经典方形 Logo ---- */
function RoboGuard() {
  return (
    <>
      <div className={styles.roboAntenna}>
        <div className={styles.roboAntennaBall} />
        <div className={styles.roboAntennaStick} />
      </div>
      <div className={styles.roboBody}>
        <div className={`${styles.roboEar} ${styles.roboEarLeft}`} />
        <div className={`${styles.roboEar} ${styles.roboEarRight}`} />
        <div className={styles.roboFace}>
          <div className={styles.roboEyes}>
            <div className={styles.roboEye} />
            <div className={styles.roboEye} />
          </div>
          <div className={styles.roboMouth} />
        </div>
      </div>
    </>
  );
}

/* ---- 3. 嵌入式 - 智能芯片 ---- */
function SmartChip() {
  return (
    <div className={styles.chipWrap}>
      <div className={styles.chipBody}>
        {/* 上排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupTop}`}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`${styles.chipPin} ${i % 2 === 0 ? styles.lit : ''}`}
            />
          ))}
        </div>
        {/* 下排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupBottom}`}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`${styles.chipPin} ${i % 2 === 1 ? styles.lit : ''}`}
            />
          ))}
        </div>
        {/* 左排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupLeft}`}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`${styles.chipPin} ${i === 0 || i === 3 ? styles.lit : ''}`}
            />
          ))}
        </div>
        {/* 右排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupRight}`}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`${styles.chipPin} ${i === 1 || i === 2 ? styles.lit : ''}`}
            />
          ))}
        </div>
        {/* 晶圆 + 面部 */}
        <div className={styles.chipDie}>
          <Face />
        </div>
      </div>
      <div className={styles.chipBase} />
    </div>
  );
}
