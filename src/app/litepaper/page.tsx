import type { Metadata } from "next";
import { stages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Protocol overview — Serenith Litepaper",
  description:
    "A draft overview of the Serenith architecture: local embeddings, encrypted matching, proof of existence, and controlled collaboration.",
};

export default function Litepaper() {
  return (
    <main className="paper-page">
      <a className="back-link" href="/">
        ← Back to Serenith
      </a>
      <div className="eyebrow" style={{ marginTop: 45 }}>
        SERENITH / PROTOCOL OVERVIEW
      </div>
      <h1>
        Discover the connection.
        <br />
        <span className="gradient-text">Protect the discovery.</span>
      </h1>
      <p className="lead">
        A private coordination layer for research, designed to reveal meaningful
        compatibility while keeping the underlying knowledge confidential.
      </p>
      <p className="draft-note">
        Architecture draft — this overview summarizes the supplied Serenith
        website specification. The website is an interactive protocol
        visualization, not a deployed cryptographic service. It does not encrypt
        or upload research, execute contracts, or sign NDAs.
      </p>
      <nav className="paper-index" aria-label="Litepaper contents">
        <a href="#problem">The problem</a>
        <a href="#architecture">Architecture</a>
        <a href="#security">Security model</a>
        <a href="#primitives">Primitives</a>
        <a href="#open-questions">Open questions</a>
      </nav>
      <section id="problem">
        <h2>01 / The collaboration paradox</h2>
        <p>
          Research collaboration often begins with disclosure. Yet unpublished
          findings, proprietary formulations, and sensitive capabilities may be
          too valuable to expose. Serenith proposes separating the discovery of
          a compatible partner from disclosure of the underlying work: compare
          encrypted semantic representations first, then let the parties choose
          whether to collaborate.
        </p>
      </section>
      <section id="architecture">
        <h2>02 / A six-stage data journey</h2>
        <ol>
          {stages.map((stage) => (
            <li key={stage.short}>
              <strong>{stage.title}</strong>
              <br />
              {stage.body}
            </li>
          ))}
        </ol>
      </section>
      <section id="security">
        <h2>03 / Security model</h2>
        <p>
          The proposed trust boundary keeps plaintext documents and their
          original embeddings on the client. The network receives encrypted
          representations and integrity proofs. Content storage is separated
          from the on-chain fingerprint and escrow state. Distributed key
          management is intended to avoid placing decryption power with one
          operator.
        </p>
        <ul>
          <li>
            <strong>Model inversion:</strong> the architecture aims to prevent
            direct inspection of plaintext embeddings by computation nodes.
          </li>
          <li>
            <strong>Semantic sonar and two-hop extraction:</strong> progressive
            disclosure and constrained outputs must be combined with query
            policies that limit adversarial probing.
          </li>
          <li>
            <strong>Metadata:</strong> public content identifiers, timing,
            transaction relationships, and network traffic need a separate
            privacy analysis. Content encryption alone does not conceal all
            metadata.
          </li>
          <li>
            <strong>Griefing:</strong> stakes and escrow incentives are proposed
            to discourage abusive submissions. Parameters and enforcement remain
            implementation decisions.
          </li>
        </ul>
        <p>
          A proof-of-existence timestamp records a commitment at a point in
          time; it does not by itself establish authorship, patentability,
          ownership, or legal priority. Security properties depend on concrete
          cryptographic parameters, implementations, and the final threat model.
        </p>
      </section>
      <section id="primitives">
        <h2>04 / Cryptographic foundation</h2>
        <ul>
          <li>
            <strong>TFHE / tfhe-rs:</strong> fully homomorphic encryption for
            computation over encrypted values.{" "}
            <a
              href="https://github.com/zama-ai/tfhe-rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the upstream library ↗
            </a>
          </li>
          <li>
            <strong>Matryoshka Representation Learning:</strong> nested
            representations for graduated semantic comparison.
          </li>
          <li>
            <strong>Threshold KMS:</strong> distributed participation in
            authorized result disclosure.
          </li>
          <li>
            <strong>Zero-knowledge proofs:</strong> integrity checks without
            disclosure of private inputs.
          </li>
          <li>
            <strong>EVM smart contracts:</strong> proposed fingerprint
            registration, staking, and settlement coordination.
          </li>
          <li>
            <strong>IPFS / Arweave:</strong> proposed persistence for encrypted
            payloads, separate from on-chain state.
          </li>
        </ul>
      </section>
      <section id="open-questions">
        <h2>05 / From architecture to implementation</h2>
        <p>
          The website specification does not define production cryptographic
          parameters, concrete embedding models, matching thresholds,
          key-rotation and recovery policies, staking economics, metadata
          protection, or a legally reviewed NDA workflow. These require
          implementation, benchmarking, and independent review before the
          protocol can offer production guarantees.
        </p>
        <p style={{ marginTop: 16 }}>
          All identifiers, matches, and proofs shown in the animated journey are
          illustrative. No wallet connection, research upload, or personal
          information is needed to explore this website.
        </p>
      </section>
      <a className="button button-primary" href="/#workflow-scroll-track">
        Explore the interactive journey →
      </a>
    </main>
  );
}
