"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Icon,
  ParticleGlobe,
  ResearchDocument,
  WorkflowVisual,
} from "@/components/visuals";
import { stages, useCases } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Serenith home">
      <svg viewBox="140 395 720 145" role="img" aria-label="Serenith">
        <image href="/logo.svg" width="1000" height="1000" />
      </svg>
    </a>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeCase, setActiveCase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const track = useRef<HTMLElement>(null);
  const artifact = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const caseButtons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const smooth = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: { offset: -76 },
    });
    lenis.current = smooth;
    smooth.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => smooth.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      smooth.destroy();
      lenis.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const section = track.current;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (reducedMotion) return;
        setProgress(self.progress);
        setStage(
          Math.max(
            0,
            stages.findLastIndex((item) => self.progress >= item.start),
          ),
        );
      },
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => trigger.kill();
  }, [reducedMotion]);

  // One document moves from the hero into the local sandbox before it becomes a vector.
  useEffect(() => {
    const documentElement = artifact.current;
    const hero = document.querySelector<HTMLElement>(".hero-document-target");
    const target = document.querySelector<HTMLElement>(
      ".workflow-document-target",
    );
    if (!documentElement || !hero || !target || !track.current) return;
    const move = () => {
      const from = hero.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const section = track.current!.getBoundingClientRect();
      const journey = Math.max(
        0,
        Math.min(1, (window.innerHeight - section.top) / window.innerHeight),
      );
      const mobile = window.innerWidth < 768;
      const inHero = from.bottom > 0;
      const inWorkflow = section.top < window.innerHeight && section.bottom > 0;
      const trackProgress = Math.max(
        0,
        -section.top / (section.height - window.innerHeight),
      );
      const fold = reducedMotion
        ? 0
        : Math.max(0, Math.min(1, (trackProgress - 0.12) / 0.04));
      const x =
        inHero && journey === 0
          ? from.left
          : from.left + (to.left - from.left) * journey;
      const y =
        inHero && journey === 0
          ? from.top
          : from.top + (to.top - from.top) * journey;
      const scale =
        ((inHero ? from.width : to.width) / 190) * (1 - fold * 0.75);
      gsap.set(documentElement, {
        x: x + (inWorkflow ? to.width * fold * 0.375 : 0),
        y: y + (inWorkflow ? to.height * fold * 0.375 : 0),
        scale,
        rotation: inHero ? -9 : fold * 55,
        opacity:
          (inHero || inWorkflow) && (stage === 0 || !inWorkflow) ? 1 - fold : 0,
        visibility: mobile && !inHero && journey < 0.8 ? "hidden" : "visible",
      });
    };
    move();
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: move,
      onRefresh: move,
    });
    window.addEventListener("resize", move);
    return () => {
      trigger.kill();
      window.removeEventListener("resize", move);
    };
  }, [stage, reducedMotion]);

  useEffect(() => {
    if (!menu) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menu]);

  function goToStage(index: number) {
    if (reducedMotion) {
      setStage(index);
      setProgress(stages[index].start + 0.01);
      return;
    }
    const section = track.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const destination =
      top +
      (section.offsetHeight - window.innerHeight) *
        (stages[index].start + 0.012);
    if (lenis.current) lenis.current.scrollTo(destination, { duration: 1 });
    else window.scrollTo({ top: destination, behavior: "smooth" });
  }

  const current = stages[stage];
  const example = useCases[activeCase];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav
            id="main-navigation"
            className={menu ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {[
              ["The protocol", "#workflow-scroll-track"],
              ["Use cases", "#use-cases"],
              ["Security", "#security"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
            <a
              href="/litepaper/"
              className="mobile-paper"
              onClick={() => setMenu(false)}
            >
              Read the litepaper <Icon name="diagonal" size={14} />
            </a>
          </nav>
          <a className="header-cta" href="/litepaper/">
            Read the litepaper <Icon name="diagonal" size={14} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="main-navigation"
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main id="main">
        <section
          className="hero section-shell"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-grid-bg" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="blue-dot" /> THE PRIVATE COORDINATION LAYER FOR
              R&D
            </div>
            <h1 id="hero-title">
              Breakthroughs.
              <br />
              Without
              <br />
              <span className="gradient-text">exposure.</span>
            </h1>
            <p className="hero-description">
              The right connection changes everything.
              <br />
              Discover research that complements yours.
              <br className="desktop-break" /> Without revealing what makes it
              yours.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#workflow-scroll-track"
              >
                Explore the protocol <Icon name="arrow" size={18} />
              </a>
              <a className="text-link" href="/litepaper/">
                Read the litepaper <Icon name="diagonal" size={15} />
              </a>
            </div>
            <div className="hero-proof mono">
              <Icon name="lock" size={13} />
              <span>ENCRYPTED BY DESIGN. CONNECTED BY POSSIBILITY.</span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="A private research document surrounded by an encrypted data sphere"
          >
            <div className="orbital-glow" />
            <ParticleGlobe />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="hero-document-target" />
            <div className="art-label art-label-top mono">
              <span className="small-cross">+</span> YOUR KNOWLEDGE
              <br />
              <span className="muted">PRIVATE. ALWAYS.</span>
            </div>
            <div className="cipher-tag mono">
              <Icon name="lock" size={13} /> 0x7f3a…c92e
            </div>
            <div className="art-label art-label-bottom mono">
              <span className="blue-dot" /> SEMANTIC CONNECTION
              <br />
              <span className="muted">WITHOUT DISCLOSURE</span>
            </div>
            <div className="art-coordinate mono">
              41° 24′ N &nbsp; / &nbsp; ENCRYPTED SPACE
            </div>
          </div>
          <div className="hero-footer">
            <a href="#trust-crisis" className="scroll-cue">
              <span className="scroll-line" />
              <span>Scroll to trace your data</span>
              <span>↓</span>
            </a>
            <span className="mono hero-footer-note">
              PRIVATE INPUTS. SHARED POSSIBILITY.
            </span>
          </div>
        </section>

        <section
          id="trust-crisis"
          className="trust-section section-shell section-spacing"
          aria-labelledby="trust-title"
        >
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">01 / THE TRUST GAP</span>
              <h2 id="trust-title">
                Science moves forward.
                <br />
                <span className="muted">Trust holds it back.</span>
              </h2>
            </div>
            <p>
              To find a collaborator, you have to share.
              <br />
              To protect a discovery, you have to stay silent.
              <br />
              It&apos;s time to break the paradox.
            </p>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <div className="card-top">
                <Icon name="fingerprint" />
                <span className="mono">01</span>
              </div>
              <div className="threat-art scooping" aria-hidden="true">
                <span className="mini-document">
                  ORIGINAL
                  <br />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="copy-path">·············→</span>
                <span className="mini-document stolen">
                  PUBLISHED
                  <br />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <h3>
                First to discover.
                <br />
                Second to publish.
              </h3>
              <p>
                Sharing too early can mean losing priority. Research scooping
                turns openness into a risk.
              </p>
              <span className="card-foot mono">THE PRIORITY PROBLEM</span>
            </article>
            <article className="trust-card">
              <div className="card-top">
                <Icon name="eye" />
                <span className="mono">02</span>
              </div>
              <div className="threat-art scraping" aria-hidden="true">
                <span>∂u/∂t + (u · ∇)u = −∇p + ν∇²u</span>
                <div className="scan-bar" />
                <small>EXTRACTING KNOWLEDGE…</small>
              </div>
              <h3>
                Your life&apos;s work.
                <br />
                Someone else&apos;s training data.
              </h3>
              <p>
                Mass AI scraping absorbs exposed research. Visibility
                shouldn&apos;t mean surrendering control.
              </p>
              <span className="card-foot mono">THE EXTRACTION PROBLEM</span>
            </article>
            <article className="trust-card">
              <div className="card-top">
                <Icon name="link" />
                <span className="mono">03</span>
              </div>
              <div className="threat-art paradox" aria-hidden="true">
                <span>A</span>
                <i />
                <Icon name="lock" size={20} />
                <i />
                <span>B</span>
              </div>
              <h3>
                The perfect partner.
                <br />
                Hidden in another silo.
              </h3>
              <p>
                The more valuable the discovery, the harder it is to share.
                Complementary ideas never meet.
              </p>
              <span className="card-foot mono">THE COLLABORATION PARADOX</span>
            </article>
          </div>
          <div className="section-bridge">
            <span />
            What if you could discover the connection, without exposing the
            discovery?
            <span />
          </div>
        </section>

        <section
          id="workflow-scroll-track"
          className={`workflow-track ${reducedMotion ? "reduced-motion" : ""}`}
          ref={track}
          aria-label="The data journey"
        >
          <div className="sticky-stage">
            <div className="workflow-top section-shell">
              <span className="eyebrow">02 / THE DATA JOURNEY</span>
              <a href="#pillars">
                Skip the journey <span>↘</span>
              </a>
            </div>
            <div className="workflow-grid section-shell">
              <div
                className="workflow-copy"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="stage-counter mono">
                  <span>0{stage + 1}</span>
                  <span>/ 06</span>
                  <i />
                </div>
                <div className="stage-narrative" key={stage}>
                  <div className="eyebrow stage-tag">
                    STAGE 0{stage + 1} // {current.tag}
                  </div>
                  <h2>{current.title}</h2>
                  <p>{current.body}</p>
                  <div
                    className={`data-status ${stage === 5 ? "verified" : ""}`}
                  >
                    <Icon name={stage === 5 ? "check" : "lock"} size={16} />
                    <div>
                      <span className="mono">
                        {stage === 3
                          ? "ON-CHAIN STATUS"
                          : stage === 4
                            ? "COMPUTATION"
                            : stage === 5
                              ? "RESULT"
                              : "DATA STATE"}
                      </span>
                      <strong>{current.status}</strong>
                      <small className="mono">[{current.location}]</small>
                    </div>
                  </div>
                </div>
              </div>
              <WorkflowVisual stage={stage} progress={progress} />
            </div>
            <div className="workflow-bottom section-shell">
              <div className="journey-nav" aria-label="Data journey stages">
                {stages.map((item, i) => (
                  <button
                    key={item.short}
                    aria-label={`Stage ${i + 1}: ${item.short}`}
                    aria-current={stage === i ? "step" : undefined}
                    onClick={() => goToStage(i)}
                  >
                    <span className="mono">0{i + 1}</span>
                    <span>{item.short}</span>
                    <i />
                  </button>
                ))}
              </div>
              <p className="journey-hint mono">
                {reducedMotion
                  ? "SELECT A STAGE TO EXPLORE"
                  : "SCROLL TO FOLLOW YOUR DATA"}{" "}
                <span>↓</span>
              </p>
            </div>
          </div>
        </section>

        <section
          id="pillars"
          className="pillars-section section-shell section-spacing"
          aria-labelledby="pillars-title"
        >
          <div className="section-heading">
            <span className="eyebrow">03 / BUILT FOR WHAT COMES NEXT</span>
            <h2 id="pillars-title">
              Keep your edge.
              <br />
              <span className="muted">Expand your possibilities.</span>
            </h2>
          </div>
          <div className="pillars-grid">
            {[
              [
                "link",
                "Private semantic matching",
                "Find the connection, not the keywords. Discover complementary expertise through encrypted, multi-layer semantic comparison.",
                "MEANING OVER METADATA",
              ],
              [
                "fingerprint",
                "Immutable proof of existence",
                "Make your priority verifiable before publication. Anchor a cryptographic fingerprint while the research itself stays private.",
                "PROOF WITHOUT PUBLICATION",
              ],
              [
                "layers",
                "A model-agnostic layer",
                "Keep your tools. Connect your knowledge. An embedding layer designed to work across research domains and model choices.",
                "YOUR MODELS. ONE PRIVATE LAYER.",
              ],
            ].map(([icon, title, body, label]) => (
              <article key={title}>
                <div className="pillar-icon">
                  <Icon name={icon} size={27} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="mono">{label}</span>
              </article>
            ))}
          </div>
        </section>

        <section
          id="use-cases"
          className="use-cases-section section-shell section-spacing"
          aria-labelledby="use-cases-title"
        >
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">04 / HIGH-STAKES CONNECTIONS</span>
              <h2 id="use-cases-title">
                Where confidentiality
                <br />
                <span className="muted">meets possibility.</span>
              </h2>
            </div>
            <p>
              For the discoveries that are too important
              <br />
              to stay isolated. And too valuable to expose.
            </p>
          </div>
          <div
            className="case-tabs"
            role="tablist"
            aria-label="Research sectors"
          >
            {useCases.map((item, i) => (
              <button
                key={item.label}
                ref={(el) => {
                  caseButtons.current[i] = el;
                }}
                role="tab"
                id={`case-tab-${i}`}
                aria-selected={activeCase === i}
                aria-controls={`case-panel-${i}`}
                tabIndex={activeCase === i ? 0 : -1}
                onClick={() => setActiveCase(i)}
                onKeyDown={(event) => {
                  let next = i;
                  if (event.key === "ArrowRight")
                    next = (i + 1) % useCases.length;
                  else if (event.key === "ArrowLeft")
                    next = (i + useCases.length - 1) % useCases.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = useCases.length - 1;
                  else return;
                  event.preventDefault();
                  setActiveCase(next);
                  caseButtons.current[next]?.focus();
                }}
              >
                <span className="mono">{item.number}</span>
                {item.label}
                <Icon name="diagonal" size={14} />
              </button>
            ))}
          </div>
          <div
            className="case-panel"
            id={`case-panel-${activeCase}`}
            role="tabpanel"
            aria-labelledby={`case-tab-${activeCase}`}
            tabIndex={0}
          >
            <div className="case-copy" key={activeCase}>
              <span className="eyebrow">{example.category}</span>
              <h3>{example.title}</h3>
              <p>{example.body}</p>
              <div className="case-tags">
                {example.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={`case-illustration case-${activeCase}`}>
              <span className="mono case-diagram-label">
                ILLUSTRATIVE COLLABORATION
              </span>
              <div className="match-diagram">
                <div className="match-orbit" />
                <div className="match-orbit second" />
                <div className="match-node node-a">
                  <Icon
                    name={
                      activeCase === 0
                        ? "layers"
                        : activeCase === 1
                          ? "shield"
                          : activeCase === 2
                            ? "code"
                            : "fingerprint"
                    }
                    size={34}
                  />
                  <span className="mono">RESEARCH A</span>
                </div>
                <div className="match-node node-b">
                  <Icon
                    name={
                      activeCase === 0
                        ? "link"
                        : activeCase === 1
                          ? "globe"
                          : activeCase === 2
                            ? "layers"
                            : "code"
                    }
                    size={34}
                  />
                  <span className="mono">RESEARCH B</span>
                </div>
                <div className="match-connection">
                  <span />
                  <Icon name="lock" size={18} />
                  <span />
                </div>
              </div>
              <div className="match-labels">
                <span>{example.a}</span>
                <span>{example.b}</span>
              </div>
              <div className="match-result">
                <span className="blue-dot" />
                {example.result}
                <Icon name="diagonal" size={13} />
              </div>
            </div>
          </div>
        </section>

        <section
          id="security"
          className="security-section section-shell section-spacing"
          aria-labelledby="security-title"
        >
          <div className="security-intro">
            <span className="eyebrow">05 / ZERO TRUST. BY DESIGN.</span>
            <h2 id="security-title">
              Don&apos;t trust
              <br />
              the middleman.
              <br />
              <span className="gradient-text">Trust the math.</span>
            </h2>
            <p>
              Confidentiality belongs in the architecture.
              <br />
              Every layer is designed to minimize what
              <br className="desktop-break" /> anyone else can learn.
            </p>
            <a className="text-link" href="/litepaper/#security">
              Explore the security model <Icon name="diagonal" size={16} />
            </a>
            <div className="security-seal">
              <Icon name="shield" size={56} />
              <span className="mono">
                PRIVATE INPUTS
                <br />
                VERIFIABLE OUTCOMES
              </span>
            </div>
          </div>
          <div className="security-list">
            {[
              [
                "01",
                "Model inversion",
                "Keep plaintext embeddings out of the network. Computation operates on ciphertext, reducing exposure to attempts to reconstruct source research.",
                "eye",
              ],
              [
                "02",
                "Semantic sonar",
                "Progressive disclosure and constrained matching are designed to resist probing and two-hop extraction of sensitive information.",
                "globe",
              ],
              [
                "03",
                "Metadata exposure",
                "Minimize information beyond the match itself. Keep content and unnecessary research metadata outside the public on-chain record.",
                "lock",
              ],
              [
                "04",
                "Griefing & spam",
                "Security stakes and escrow incentives discourage frivolous submissions and abusive matching behavior.",
                "shield",
              ],
            ].map(([number, title, body, icon]) => (
              <article key={number}>
                <span className="mono security-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <Icon name={icon} size={23} />
              </article>
            ))}
          </div>
        </section>

        <section
          id="foundation"
          className="foundation-section section-shell section-spacing"
          aria-labelledby="foundation-title"
        >
          <div className="foundation-heading">
            <span className="eyebrow">06 / CRYPTOGRAPHIC FOUNDATION</span>
            <h2 id="foundation-title">
              Deep science. <span className="muted">Solid foundations.</span>
            </h2>
            <p>
              A protocol architecture built around composable cryptographic
              primitives.
            </p>
          </div>
          <div className="tech-grid">
            {[
              ["TFHE", "Fully homomorphic encryption", "tfhe-rs"],
              ["MRL", "Hierarchical representations", "SEMANTIC LAYERS"],
              ["Threshold KMS", "Distributed key management", "SHARED TRUST"],
              ["ZKP", "Proof without disclosure", "INPUT INTEGRITY"],
              ["EVM", "Programmable settlement", "SMART CONTRACTS"],
              [
                "IPFS / Arweave",
                "Decentralized persistence",
                "ENCRYPTED STORAGE",
              ],
            ].map(([title, description, label]) => (
              <div className="tech-cell" key={title}>
                <span className="tech-symbol" aria-hidden="true">
                  {title === "TFHE"
                    ? "ƒ"
                    : title === "MRL"
                      ? "◎"
                      : title === "Threshold KMS"
                        ? "⁙"
                        : title === "ZKP"
                          ? "◇"
                          : title === "EVM"
                            ? "⬡"
                            : "▧"}
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="mono">{label}</span>
              </div>
            ))}
          </div>
          <div className="closing-cta">
            <div>
              <span className="eyebrow">THE NEXT CONNECTION STARTS HERE.</span>
              <h2>
                Let knowledge connect.
                <br />
                <span className="muted">Let discovery stay yours.</span>
              </h2>
            </div>
            <a className="button button-primary" href="/litepaper/">
              Explore the litepaper <Icon name="arrow" size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Discover the connection.
              <br />
              Protect the discovery.
            </p>
          </div>
          <div className="footer-links">
            <a href="#workflow-scroll-track">Protocol</a>
            <a href="#security">Security</a>
            <a href="/litepaper/">
              Litepaper <Icon name="diagonal" size={12} />
            </a>
            <a
              href="https://github.com/zama-ai/tfhe-rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              tfhe-rs on GitHub <Icon name="diagonal" size={12} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Serenith</span>
          <span className="mono">
            <span className="blue-dot" /> KNOWLEDGE WITHOUT EXPOSURE
          </span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
      <div ref={artifact} id="data-artifact" className="traveling-document">
        <ResearchDocument />
      </div>
      <noscript>
        <div className="noscript-note">
          Enable JavaScript to explore the animated data journey and sector
          tabs. The complete protocol overview is available in the{" "}
          <a href="/litepaper/">litepaper</a>.
        </div>
      </noscript>
    </>
  );
}
