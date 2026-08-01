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
        {type === 'ai' && <AiBrain />}
        {type === 'robots' && <RoboGuard />}
        {type === 'embedded' && <SmartChip />}
      </div>
    </div>
  );
}

/* ============================================================
 * 嵌入式 —— 智能芯片（中心 Processor + 引脚随机发光）
 * ========================================================== */
// 每根引脚的随机相位：delay 错开、duration 略有差异，形成无规律的闪烁节奏
const PIN_PHASES = [
  {delay: 0.0, dur: 2.3},
  {delay: 1.1, dur: 3.1},
  {delay: 0.4, dur: 2.7},
  {delay: 1.8, dur: 2.0},
  {delay: 0.9, dur: 3.4},
  {delay: 2.4, dur: 2.5},
];

function SmartChip() {
  return (
    <div className={styles.chipWrap}>
      {/* 中心芯片 */}
      <div className={styles.chipBody}>
        {/* 上排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupTop}`}>
          {PIN_PHASES.map((p, i) => (
            <div
              key={i}
              className={styles.chipPin}
              style={{
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>
        {/* 下排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupBottom}`}>
          {PIN_PHASES.map((p, i) => (
            <div
              key={i}
              className={styles.chipPin}
              style={{
                animationDelay: `${p.delay + 0.6}s`,
                animationDuration: `${(p.dur + 0.4) % 4}s`,
              }}
            />
          ))}
        </div>
        {/* 左排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupLeft}`}>
          {PIN_PHASES.slice(0, 4).map((p, i) => (
            <div
              key={i}
              className={styles.chipPin}
              style={{
                animationDelay: `${p.delay + 1.2}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>
        {/* 右排引脚 */}
        <div className={`${styles.chipPinGroup} ${styles.chipPinGroupRight}`}>
          {PIN_PHASES.slice(0, 4).map((p, i) => (
            <div
              key={i}
              className={styles.chipPin}
              style={{
                animationDelay: `${p.delay + 1.9}s`,
                animationDuration: `${(p.dur + 0.5) % 4}s`,
              }}
            />
          ))}
        </div>
        {/* 晶圆 + Processor 字样（居中、字号更小） */}
        <div className={styles.chipDie}>
          <span className={styles.chipLabel}>Processor</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * AI —— 神经网络脉冲（智能体的核心意象）
 * 中心核心不断向外发射信号，沿连线在节点间流动、回环，
 * 表现智能体持续感知、推理、连接信息的能力
 * ========================================================== */
const AI_CX = 70;
const AI_CY = 70;
const AI_R = 52;
// 六边形分布的 6 个外围节点
const AI_NET_NODES = Array.from({length: 6}, (_, i) => {
  const a = (i * 60 * Math.PI) / 180;
  return {x: AI_CX + Math.cos(a) * AI_R, y: AI_CY + Math.sin(a) * AI_R};
});

function AiBrain() {
  return (
    <div className={styles.aiBrain}>
      <svg className={styles.aiNet} viewBox="0 0 140 140" aria-hidden>
        {/* 放射连线：核心 -> 节点 */}
        {AI_NET_NODES.map((n, i) => (
          <line
            key={`s${i}`}
            x1={AI_CX}
            y1={AI_CY}
            x2={n.x}
            y2={n.y}
            className={styles.aiSpoke}
          />
        ))}
        {/* 环线：相邻节点相连，构成网络 */}
        {AI_NET_NODES.map((n, i) => {
          const m = AI_NET_NODES[(i + 1) % 6];
          return (
            <line
              key={`r${i}`}
              x1={n.x}
              y1={n.y}
              x2={m.x}
              y2={m.y}
              className={styles.aiRing}
            />
          );
        })}
        {/* 流动的信号粒子：核心 <-> 节点 往返 */}
        {AI_NET_NODES.map((n, i) => (
          <circle
            key={`p${i}`}
            r="2.4"
            className={styles.aiPacket}
            style={{animationDelay: `${(i * 0.9).toFixed(2)}s`}}
          >
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              path={`M${AI_CX} ${AI_CY} L${n.x.toFixed(1)} ${n.y.toFixed(1)}`}
            />
          </circle>
        ))}
        {/* 外围节点 */}
        {AI_NET_NODES.map((n, i) => (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r="4.5"
            className={styles.aiNode}
            style={{animationDelay: `${(i * 0.9).toFixed(2)}s`}}
          />
        ))}
        {/* 中心核心：机器人小 logo（替代纯圆点） */}
        <circle cx={AI_CX} cy={AI_CY} r="20" className={styles.aiCoreGlow} />
        <g className={styles.aiCoreBot}>
          {/* 天线 */}
          <line
            x1={AI_CX}
            y1={AI_CY - 13}
            x2={AI_CX}
            y2={AI_CY - 18}
            className={styles.aiBotAntenna}
          />
          <circle
            cx={AI_CX}
            cy={AI_CY - 20}
            r="2.4"
            className={styles.aiBotAntennaBall}
          />
          {/* 头部外框 */}
          <rect
            x={AI_CX - 12}
            y={AI_CY - 13}
            width="24"
            height="22"
            rx="6"
            className={styles.aiBotHead}
          />
          {/* 眼睛 */}
          <circle
            cx={AI_CX - 5}
            cy={AI_CY - 4}
            r="2.4"
            className={styles.aiBotEye}
          />
          <circle
            cx={AI_CX + 5}
            cy={AI_CY - 4}
            r="2.4"
            className={styles.aiBotEye}
          />
          {/* 嘴 */}
          <rect
            x={AI_CX - 5}
            y={AI_CY + 3}
            width="10"
            height="2.4"
            rx="1.2"
            className={styles.aiBotMouth}
          />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
 * 机器人 —— 经典方形机器人 Logo（保持不变）
 * ========================================================== */
function RoboGuard() {
  return (
    <div className={styles.roboWrap}>
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
    </div>
  );
}
