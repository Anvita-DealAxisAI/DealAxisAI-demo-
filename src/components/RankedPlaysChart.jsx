import { useState } from 'react';
import './RankedPlaysChart.css';

const RANK_COLORS = [
  '#3b82f6', // 1
  '#06b6d4', // 2
  '#8b5cf6', // 3
  '#10b981', // 4
  '#f59e0b', // 5
  '#6366f1', // 6
  '#f97316', // 7
  '#ec4899', // 8
  '#a78bfa', // 9
  '#94a3b8', // 10
];

const SVG_SIZE   = 260;
const CX         = SVG_SIZE / 2;
const CY         = SVG_SIZE / 2;
const R_INNER    = 16;
const R_MAX      = 115;
const R_MIN      = 69;
const GAP_DEG    = 2.5;      // angular gap between wedges

function polarToXY(r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function wedgePath(rInner, rOuter, startDeg, endDeg) {
  const sweep = endDeg - startDeg > 180 ? 1 : 0;
  const p1 = polarToXY(rInner, startDeg);
  const p2 = polarToXY(rInner, endDeg);
  const p3 = polarToXY(rOuter, endDeg);
  const p4 = polarToXY(rOuter, startDeg);
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${sweep} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${sweep} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function labelPos(rInner, rOuter, startDeg, endDeg) {
  const midAngle = (startDeg + endDeg) / 2;
  const midR = rInner + (rOuter - rInner) * 0.55;
  return polarToXY(midR, midAngle);
}

export default function RankedPlaysChart({ plays = [] }) {
  const [hovered, setHovered] = useState(1);
  const active  = plays.find((p) => p.rank === hovered) ?? plays[0] ?? null;
  const sorted  = [...plays].sort((a, b) => a.rank - b.rank);
  const N       = sorted.length;
  const sliceDeg = 360 / N;

  const rStep = N > 1 ? (R_MAX - R_MIN) / (N - 1) : 0;

  return (
    <div className="rpc">
      <div className="rpc__header">
        <h3 className="rpc__heading">Opportunity Prioritisation</h3>
        <p className="rpc__sub">Each sector = one play · Height = rank strength · Hover to explore</p>
      </div>

      <div className="rpc__body">

        {/* ── Coxcomb chart ── */}
        <div className="rpc__svg-wrap">
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          >
            {sorted.map((play, i) => {
              const startDeg = -90 + i * sliceDeg + GAP_DEG / 2;
              const endDeg   = -90 + (i + 1) * sliceDeg - GAP_DEG / 2;
              const rOuter   = R_MAX - (play.rank - 1) * rStep;
              const color    = RANK_COLORS[play.rank - 1];
              const isActive = hovered === play.rank;
              const lp       = labelPos(R_INNER, rOuter, startDeg, endDeg);

              return (
                <g
                  key={play.rank}
                  onMouseEnter={() => setHovered(play.rank)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Shadow wedge when active */}
                  {isActive && (
                    <path
                      d={wedgePath(R_INNER - 2, rOuter + 8, startDeg - 0.5, endDeg + 0.5)}
                      fill={color}
                      opacity={0.18}
                    />
                  )}
                  {/* Main wedge */}
                  <path
                    d={wedgePath(R_INNER, rOuter, startDeg, endDeg)}
                    fill={color}
                    opacity={isActive ? 1 : 0.7}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 6px ${color}aa)` : 'none',
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                  {/* Rank number label (only if wedge is wide enough) */}
                  {rOuter - R_INNER > 18 && (
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={isActive ? '16' : '14'}
                      fontWeight="800"
                      fill="#000000"
                      style={{ pointerEvents: 'none', transition: 'font-size 0.15s' }}
                    >
                      {play.rank}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center cap */}
            <circle cx={CX} cy={CY} r={R_INNER} fill="#0d1117" />
            {active && (
              <>
                <circle cx={CX} cy={CY} r={R_INNER} fill={`${RANK_COLORS[active.rank - 1]}22`} />
                <text
                  x={CX} y={CY - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill={RANK_COLORS[active.rank - 1]}
                >
                  #{active.rank}
                </text>
                <text
                  x={CX} y={CY + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fill="#64748b"
                >
                  rank
                </text>
              </>
            )}
          </svg>
        </div>

        {/* ── Detail panel ── */}
        {active && (
          <div className="rpc__detail rpc__detail--visible">
            <div className="rpc__detail-header">
              <span
                className="rpc__detail-rank"
                style={{ color: RANK_COLORS[active.rank - 1] }}
              >
                #{active.rank}
              </span>
              <div className="rpc__detail-header-chips">
                <span
                  className="rpc__chip"
                  style={{
                    background: `${RANK_COLORS[active.rank - 1]}18`,
                    color: RANK_COLORS[active.rank - 1],
                    borderColor: RANK_COLORS[active.rank - 1],
                  }}
                >
                  {active.priority}
                </span>
                <span className="rpc__chip rpc__chip--readiness">{active.salesReadiness} readiness</span>
                <span className="rpc__chip rpc__chip--conf">Conf {active.confidence}/5</span>
                {active.dealMidpoint && (
                  <span className="rpc__chip rpc__chip--deal">~${active.dealMidpoint}M</span>
                )}
              </div>
            </div>

            <h4 className="rpc__detail-title">{active.title}</h4>

            <div className="rpc__detail-rows">
              <div className="rpc__detail-row">
                <span className="rpc__detail-key">Why strong</span>
                <span className="rpc__detail-val">{active.why}</span>
              </div>
              <div className="rpc__detail-row">
                <span className="rpc__detail-key">Entry wedge</span>
                <span className="rpc__detail-val rpc__detail-val--quote">"{active.entryWedge}"</span>
              </div>
              <div className="rpc__detail-row">
                <span className="rpc__detail-key">First buyer</span>
                <span className="rpc__detail-val">{active.firstBuyer}</span>
              </div>
              <div className="rpc__detail-row">
                <span className="rpc__detail-key">Meeting theme</span>
                <span className="rpc__detail-val rpc__detail-val--quote">"{active.meetingTheme}"</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
