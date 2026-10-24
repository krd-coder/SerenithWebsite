"use client";

import { useEffect, useRef } from "react";

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />
      </>
    ),
    link: (
      <>
        <path
          d="m10 14 4-4M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 12a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1"
          transform="translate(1 0) scale(.9)"
        />
      </>
    ),
    fingerprint: (
      <>
        <path d="M3 11a9 9 0 0 1 18 0M6 16v-5a6 6 0 0 1 12 0v6M9 20v-9a3 3 0 0 1 6 0v9M12 11v11M3 14v4M21 14v4" />
      </>
    ),
    code: (
      <>
        <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 18" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="m3 3 18 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.shield}
    </svg>
  );
}

export function ResearchDocument() {
  return (
    <div className="research-document" aria-hidden="true">
      <div className="paper-top">
        <span>RESEARCH / 001</span>
        <span>↗</span>
      </div>
      <div className="paper-title">
        The next
        <br />
        breakthrough.
      </div>
      <div className="paper-line" />
      <div className="paper-line short" />
      <svg viewBox="0 0 170 85" className="molecule">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="m44 25 23-13 23 13v27L67 65 44 52Zm46 0 23-13 23 13v27l-23 13-23-13M49 29v19m18-30 18 10m10 1 18-11m18 11v19M44 25 24 14M136 52l16 10M67 65v13M113 12V2" />
          <circle cx="22" cy="13" r="4" />
          <circle cx="155" cy="64" r="4" />
        </g>
      </svg>
      <div className="paper-formula">∂ψ / ∂t = D∇²ψ + f(ψ)</div>
      <div className="paper-line" />
      <div className="paper-line" />
      <div className="paper-line short" />
      <div className="paper-bottom">
        <span>UNPUBLISHED</span>
        <Icon name="lock" size={12} />
      </div>
    </div>
  );
}

export function ParticleGlobe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = true,
      angle = 0;
    let width = 600,
      height = 600;
    const points = Array.from({ length: 1050 }, (_, i) => {
      const y = 1 - (i / 1049) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return [Math.cos(theta) * r, y, Math.sin(theta) * r];
    });
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.355;
      points.forEach(([x, y, z], i) => {
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        const tiltY = y * 0.95 - rx * 0.18;
        const scale = 1 + rz * 0.12;
        context.beginPath();
        context.arc(
          width / 2 + rx * radius * scale,
          height / 2 + tiltY * radius * scale,
          (i % 9 === 0 ? 1.7 : 0.8) * scale,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(${i % 7 === 0 ? "156,201,255" : "61,125,248"},${0.16 + (rz + 1) * 0.34})`;
        context.fill();
      });
    };
    const tick = () => {
      if (visible && !document.hidden) {
        angle += 0.0016;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = width * dpr;
      element.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    const motionChange = () => {
      cancelAnimationFrame(frame);
      if (!media.matches) tick();
      else draw();
    };
    resize.observe(element);
    observer.observe(element);
    motionChange();
    media.addEventListener("change", motionChange);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      media.removeEventListener("change", motionChange);
    };
  }, []);
  return <canvas ref={canvas} className="particle-globe" aria-hidden="true" />;
}

function Sphere({
  x,
  y,
  r = 58,
  id,
}: {
  x: number;
  y: number;
  r?: number;
  id: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 9} fill="none" stroke="#2563eb" opacity=".22" />
      <circle
        r={r}
        fill="url(#sphere-fill)"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      <ellipse
        rx={r * 0.53}
        ry={r}
        fill="none"
        stroke="#60a5fa"
        opacity=".4"
        transform="rotate(35)"
      />
      <ellipse
        rx={r * 0.97}
        ry={r * 0.35}
        fill="none"
        stroke="#60a5fa"
        opacity=".5"
        transform="rotate(-25)"
      />
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          cx={Math.cos(i * 2.4) * r * (0.3 + (i % 4) * 0.19)}
          cy={Math.sin(i * 2.4) * r * (0.3 + (i % 4) * 0.19)}
          r={i % 3 === 0 ? 1.9 : 1}
          fill="#93c5fd"
          opacity=".7"
        />
      ))}
      <text y="5" textAnchor="middle" fill="#c1d9ff" fontSize="11">
        {id}
      </text>
    </g>
  );
}

export function WorkflowVisual({
  stage,
  progress,
}: {
  stage: number;
  progress: number;
}) {
  const crossed = progress >= 0.45;
  const layer = (n: number) => `scene-layer ${stage === n ? "is-visible" : ""}`;
  return (
    <div className="workflow-visual" data-stage={stage}>
      <div className="scene-topline mono">
        <span>
          <i className="blue-dot" /> LIVE ARCHITECTURE
        </span>
        <span>0{stage + 1} / 06</span>
      </div>
      <div className="workflow-document-target" />
      <svg
        className="workflow-svg"
        viewBox="0 0 600 480"
        role="img"
        aria-label={`Illustration of stage ${stage + 1}: ${["local document", "hierarchical semantic rings", "encrypted data crossing the device boundary", "decentralized storage and blockchain escrow", "private encrypted matching", "single-bit result and confidential channel"][stage]}`}
      >
        <defs>
          <radialGradient id="sphere-fill" cx="35%" cy="25%">
            <stop stopColor="#173b78" />
            <stop offset=".55" stopColor="#0b142c" />
            <stop offset="1" stopColor="#070a12" />
          </radialGradient>
          <linearGradient id="beam">
            <stop stopColor="#2563eb" stopOpacity="0" />
            <stop offset=".5" stopColor="#93c5fd" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
          <pattern
            id="scene-grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0H0v30"
              fill="none"
              stroke="#91baff"
              strokeOpacity=".05"
            />
          </pattern>
        </defs>
        <rect width="600" height="480" fill="url(#scene-grid)" />
        <g opacity={stage < 3 ? 1 : 0.12} className="sandbox-frame">
          <rect
            x="65"
            y="65"
            width="470"
            height="320"
            rx="8"
            fill="none"
            stroke="#57708e"
            strokeDasharray="5 6"
            opacity=".65"
          />
          <rect x="127" y="56" width="346" height="20" fill="#0a0d14" />
          <text x="300" y="70" textAnchor="middle" className="svg-label">
            LOCAL CLIENT SANDBOX · TRUSTED ZONE
          </text>
          <rect x="192" y="376" width="216" height="20" fill="#0a0d14" />
          <text x="300" y="390" textAnchor="middle" className="svg-label">
            ZERO PLAINTEXT BOUNDARY
          </text>
        </g>
        <g className={layer(0)}>
          <path
            d="M150 154h-15v30m315-30h15v30M135 290v30h15m300 0h15v-30"
            stroke="#3b82f6"
            fill="none"
          />
          <text x="300" y="433" textAnchor="middle" className="svg-label">
            ORIGINAL DOCUMENT · LOCAL MEMORY ONLY
          </text>
        </g>
        <g className={layer(1)}>
          <g className="mrl-rings" style={{ transformOrigin: "300px 232px" }}>
            {[66, 105, 145].map((r, i) => (
              <g key={r}>
                <circle
                  cx="300"
                  cy="232"
                  r={r}
                  stroke={["#93c5fd", "#60a5fa", "#2563eb"][i]}
                  fill={i === 0 ? "#2563eb15" : "none"}
                  strokeWidth={i === 0 ? 2 : 1}
                  strokeDasharray={
                    i === 2 ? "2 7" : i === 1 ? "25 5" : undefined
                  }
                />
                <circle cx={300 + r} cy="232" r="4" fill="#93c5fd" />
              </g>
            ))}
          </g>
          <text
            x="300"
            y="226"
            textAnchor="middle"
            fill="#bfdbfe"
            fontSize="14"
          >
            SEMANTIC
          </text>
          <text x="300" y="246" textAnchor="middle" className="svg-label">
            VECTOR
          </text>
          <text x="300" y="420" textAnchor="middle" className="svg-label">
            L1 DOMAIN · L2 METHODOLOGY · L3 DEEP NUANCES
          </text>
        </g>
        <g className={layer(2)}>
          <g
            style={{
              transform: `translateY(${Math.max(0, Math.min(1, (progress - 0.42) / 0.07)) * 158}px)`,
            }}
          >
            <Sphere x={300} y={216} r={72} id="0x7F…9A" />
            <text x="188" y="151" className="svg-hash">
              0x8d2f
            </text>
            <text x="395" y="258" className="svg-hash">
              a90c7e
            </text>
            <text x="193" y="282" className="svg-hash">
              f3b10a
            </text>
            <rect
              x="211"
              y="308"
              width="178"
              height="25"
              rx="12"
              fill="#0a2926"
              stroke="#10b981"
              strokeOpacity=".5"
            />
            <text
              x="300"
              y="325"
              textAnchor="middle"
              fill="#6ee7b7"
              fontSize="10"
            >
              ✓ ZK INPUT PROOF ATTACHED
            </text>
          </g>
          <path
            d="M84 120h432"
            stroke="url(#beam)"
            strokeWidth="2"
            className="encryption-scan"
          />
          <text x="300" y="445" textAnchor="middle" className="svg-label">
            {crossed
              ? "PUBLIC NETWORK · CIPHERTEXT ONLY"
              : "ENCRYPTING INSIDE THE TRUSTED ZONE"}
          </text>
        </g>
        <g className={layer(3)}>
          <path
            d="M180 265h240M300 118v74l-120 73m120-73 120 73"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <path
            d="M180 265h240"
            stroke="url(#beam)"
            strokeWidth="3"
            className="data-beam"
          />
          <Sphere x={180} y={218} r={55} id="ENCRYPTED" />
          <path
            d="m420 170 60 34v68l-60 34-60-34v-68Zm-60 34 60 34 60-34m-60 34v68m-60-102 60 34 60-34"
            fill="#10254a"
            fillOpacity=".65"
            stroke="#60a5fa"
          />
          <text
            x="420"
            y="255"
            textAnchor="middle"
            fill="#bfdbfe"
            fontSize="10"
          >
            ESCROW
          </text>
          <text x="300" y="115" textAnchor="middle" className="svg-label">
            CID HASH + SECURITY STAKE
          </text>
          <text x="180" y="337" textAnchor="middle" className="svg-label">
            STORAGE VAULT
          </text>
          <text x="180" y="357" textAnchor="middle" className="svg-hash">
            IPFS / Arweave
          </text>
          <text x="420" y="337" textAnchor="middle" className="svg-label">
            SMART CONTRACT
          </text>
          <text x="420" y="357" textAnchor="middle" className="svg-hash">
            On-chain fingerprint
          </text>
          <text
            x="300"
            y="421"
            textAnchor="middle"
            fill="#93c5fd"
            fontSize="11"
          >
            ◈ PROOF OF EXISTENCE TIMESTAMPED
          </text>
        </g>
        <g className={layer(4)}>
          {[0.72, 0.77, 0.82].map((threshold, i) => (
            <ellipse
              key={threshold}
              cx="300"
              cy="213"
              rx={110 + i * 27}
              ry={38 + i * 35}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.2"
              opacity={progress >= threshold ? 0.9 : 0.12}
            />
          ))}
          <Sphere x={196} y={213} id="PARTNER A" />
          <Sphere x={404} y={213} id="PARTNER B" />
          {[
            ["DOMAIN FILTER", 0.72],
            ["METHODOLOGY ALIGNMENT", 0.77],
            ["DEEP SYNERGY", 0.82],
          ].map(([text, threshold], i) => (
            <g key={text}>
              <circle
                cx="159"
                cy={344 + i * 27}
                r="3"
                fill={progress >= Number(threshold) ? "#60a5fa" : "#334155"}
              />
              <text
                x="174"
                y={348 + i * 27}
                className="svg-label"
                fill={progress >= Number(threshold) ? "#bfdbfe" : undefined}
              >
                L{i + 1} {text}
              </text>
              <text
                x="455"
                y={348 + i * 27}
                textAnchor="end"
                className="svg-label"
              >
                {progress >= Number(threshold)
                  ? i === 2
                    ? "CONFIRMED"
                    : "PASSED"
                  : "PENDING"}
              </text>
            </g>
          ))}
          <text x="300" y="64" textAnchor="middle" className="svg-label">
            DARK POOL · HOMOMORPHIC COMPUTATION
          </text>
        </g>
        <g className={layer(5)}>
          <ellipse
            cx="300"
            cy="220"
            rx="210"
            ry="157"
            fill="none"
            stroke="#10b981"
            strokeOpacity=".3"
            strokeDasharray="2 8"
          />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI) / 5;
            const x = 300 + Math.cos(a) * 210,
              y = 220 + Math.sin(a) * 157;
            return (
              <g key={i}>
                <path
                  d={`M${x} ${y} 300 220`}
                  stroke="#10b981"
                  strokeOpacity=".16"
                />
                <circle cx={x} cy={y} r="4" fill="#6ee7b7" />
              </g>
            );
          })}
          <path
            d="M180 220h240"
            stroke="#10b981"
            strokeOpacity=".12"
            strokeWidth="35"
          />
          <path d="M180 220h240" stroke="#6ee7b7" strokeWidth="1.5" />
          <Sphere x={180} y={220} r={49} id="PARTNER A" />
          <Sphere x={420} y={220} r={49} id="PARTNER B" />
          <rect
            x="269"
            y="189"
            width="62"
            height="62"
            rx="12"
            fill="#0b2926"
            stroke="#34d399"
          />
          <text
            x="300"
            y="231"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="30"
          >
            1
          </text>
          <text x="300" y="37" textAnchor="middle" className="svg-label">
            THRESHOLD KMS NODES
          </text>
          <text
            x="300"
            y="325"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="12"
          >
            MATCH ≥ THRESHOLD: TRUE
          </text>
          <rect
            x="114"
            y="403"
            width="372"
            height="34"
            rx="5"
            fill="#0a2926"
            stroke="#10b981"
            strokeOpacity=".4"
          />
          <text
            x="300"
            y="425"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="10"
          >
            NDA SIGNED · P2P CHANNEL UNLOCKED
          </text>
        </g>
      </svg>
      <div className="scene-bottomline mono">
        <span>
          <Icon name="lock" size={12} />{" "}
          {stage < 2 ? "PRIVATE BY DEFAULT" : "ZERO PLAINTEXT EXPOSURE"}
        </span>
        <span>PROTOCOL VISUALIZATION</span>
      </div>
      <div className="scene-progress">
        <div style={{ transform: `scaleY(${progress})` }} />
        <span style={{ transform: `translateY(${progress * 280}px)` }} />
      </div>
    </div>
  );
}
