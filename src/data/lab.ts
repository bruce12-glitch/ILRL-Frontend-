/* ────────────────────────────────────────────────────────────────────────
 * ILRL — single source of truth for site content.
 * Swap names, links, arXiv IDs and emails here; pages render from this file.
 * ──────────────────────────────────────────────────────────────────────── */

export const SITE = {
  short: "ILRL",
  name: "Inference-in-Loop & Recurrence Lab",
  longName: "Inference in Loops and Recurrent Learning Labs",
  tagline: "Systems for efficient LLM inference, built in the loop.",
  email: "hello@ilrl.dev",
  github: "https://github.com/bruce12-glitch/ILRL",
  githubOrg: "https://github.com/bruce12-glitch",
  founded: "2025",
};

/* ── Research pillars ────────────────────────────────────────────────── */

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  tag: string; // e.g. SYS–01
  name: string;
  area: string; // eyebrow category
  /** long-tail keyword headline used as the semantic <h3> for indexing */
  headline: string;
  status: string;
  blurb: string;
  detail: string;
  contributions: string[];
  metrics: Metric[];
  arxiv: string;
  arxivLabel: string;
  code: string;
  diagram: "prefill" | "kv" | "loop";
  paperId: string;
}

export const PROJECTS: Project[] = [
  {
    id: "entroprefill",
    tag: "SYS–01",
    name: "EntroPrefill",
    area: "Prefill · Sparse Attention",
    headline:
      "Mitigating long-context quadratic prefill latency with entropy-guided sparse attention",
    status: "Active",
    blurb:
      "Prefill cost grows quadratically with prompt length, so a 256K-token context can spend most of its time-to-first-token doing attention work that a token never uses. EntroPrefill measures per-token attention entropy on the fly and prunes provably low-information key ranges before they reach the attention kernel — rebuilding a causal mask that keeps the computation near-linear in context length.",
    detail:
      "The system ships as a drop-in prefill path: an entropy scorer fused into the sampling loop, a hardware-aware block-sparse kernel, and a calibration pass that bounds perplexity drift. It composes with paged KV managers and requires no changes to model weights, so existing checkpoints keep their quality while long prompts stop paying quadratic rent.",
    contributions: [
      "Entropy-guided token scoring that identifies low-information key ranges at layer depth, before attention executes.",
      "Block-sparse prefill kernel preserving causal masks, fused with FlashAttention-style tiling for Hopper GPUs.",
      "Calibration protocol with a guaranteed perplexity-drift bound (<0.4 NLL) across LongBench and RULER.",
    ],
    metrics: [
      { value: "3.1×", label: "faster TTFT @ 256K ctx" },
      { value: "−72%", label: "prefill attention FLOPs" },
      { value: "<0.4", label: "NLL perplexity drift" },
    ],
    arxiv: "https://arxiv.org/abs/2512.03310",
    arxivLabel: "arXiv:2512.03310",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "prefill",
    paperId: "entroprefill-paper",
  },
  {
    id: "page-entrokv",
    tag: "SYS–02",
    name: "Page-EntroKV",
    area: "KV-Cache · Memory",
    headline:
      "Breaking the KV-cache memory wall with entropy-tiered, paged cache compression",
    status: "Active",
    blurb:
      "Decode throughput in modern serving stacks is bounded less by compute than by KV-cache residency — the memory wall. Page-EntroKV manages the cache as entropy-tiered pages: hot pages stay in FP16 on HBM, warm pages drop to FP8, and cold pages quantize to 2-bit and migrate off-device, entirely under an SLO-aware eviction policy.",
    detail:
      "Because importance is estimated from attention entropy rather than recency heuristics, pages that look old but matter stay resident, and pages that look recent but contribute nothing are cheaply recomputable. The paged layout plugs into vLLM-style block tables, so admissions, preemption and tier migration are scheduler-visible operations rather than offline tricks.",
    contributions: [
      "Entropy-tiered paged cache: FP16 / FP8 / 2-bit pages with per-page migration cost modelling.",
      "SLO-aware eviction that provably bounds quality loss under contiguous decode deadlines.",
      "vLLM-compatible block-table integration; tier migration overlaps with kernel execution.",
    ],
    metrics: [
      { value: "−68%", label: "KV-cache memory footprint" },
      { value: "2.4×", label: "decode throughput @ context" },
      { value: "4.9×", label: "larger resident batch @ 128K" },
    ],
    arxiv: "https://arxiv.org/abs/2603.01421",
    arxivLabel: "arXiv:2603.01421",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "kv",
    paperId: "page-entrokv-paper",
  },
  {
    id: "recloop",
    tag: "SYS–03",
    name: "RecLoop",
    area: "Serving · Scheduling",
    headline:
      "Inference-in-loop scheduling: recurrence-aware continuous batching for low-latency LLM serving",
    status: "Active",
    blurb:
      "Serving is a loop: requests arrive, batch, decode a step, and re-enter the scheduler — thousands of times per second. RecLoop treats that recurrence as the object to optimize, closing the loop between the scheduler and the kernels it dispatches with admission control, preemption and speculative loops driven by predicted recurrence cost.",
    detail:
      "A recurrence-cost model predicts how long each sequence will keep looping, letting the scheduler pack continuous batches by future cost rather than current length. Paired with EntroPrefill's sparse prefill and Page-EntroKV's tiered cache, the runtime meets P99 deadlines with far less capacity — the lab's thesis is that inference always happens in a loop, and systems should be designed around that recurrence.",
    contributions: [
      "Recurrence-aware admission control and preemption driven by predicted future decode cost.",
      "Speculative draft–verify loops as first-class, scheduler-visible batch members.",
      "Open-loop benchmarks and traces released alongside the runtime for reproducibility.",
    ],
    metrics: [
      { value: "−41%", label: "P99 decode latency" },
      { value: "1.9×", label: "SLO-attaining goodput" },
      { value: "8", label: "GPU config, SLOs held" },
    ],
    arxiv: "https://arxiv.org/abs/2601.00887",
    arxivLabel: "arXiv:2601.00887",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "loop",
    paperId: "recloop-paper",
  },
];

/* ── Publications ────────────────────────────────────────────────────── */

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  area: "Prefill" | "KV-Cache" | "Serving" | "Systems" | "Survey";
  date: string; // display
  year: number;
  arxiv: string;
  arxivLabel: string;
  code?: string;
  abstract: string;
  selected?: boolean;
}

export const PAPERS: Paper[] = [
  {
    id: "page-entrokv-paper",
    title:
      "Page-EntroKV: Entropy-Tiered Paged KV-Cache Compression for Breaking the Memory Wall in Long-Context LLM Inference",
    authors: ["Bruce Raman", "Priya Nair", "Sara Okonkwo", "Ananya Iyer"],
    venue: "arXiv preprint",
    area: "KV-Cache",
    date: "Mar 2026",
    year: 2026,
    arxiv: "https://arxiv.org/abs/2603.01421",
    arxivLabel: "arXiv:2603.01421",
    code: "https://github.com/bruce12-glitch/ILRL",
    abstract:
      "Manages the KV cache as entropy-tiered pages across FP16, FP8 and 2-bit residencies, cutting cache memory by 68% and lifting decode throughput 2.4× under SLO-aware eviction.",
    selected: true,
  },
  {
    id: "recloop-paper",
    title:
      "RecLoop: Inference-in-Loop Scheduling with Recurrence-Aware Continuous Batching for Low-Latency LLM Serving",
    authors: ["Leo Zhang", "Bruce Raman", "Aditi Verma", "Marcus Feld"],
    venue: "arXiv preprint",
    area: "Serving",
    date: "Jan 2026",
    year: 2026,
    arxiv: "https://arxiv.org/abs/2601.00887",
    arxivLabel: "arXiv:2601.00887",
    code: "https://github.com/bruce12-glitch/ILRL",
    abstract:
      "Closes the loop between scheduler and kernels: recurrence-cost predictions drive admission, preemption and speculative loops, reducing P99 decode latency by 41%.",
    selected: true,
  },
  {
    id: "entroprefill-paper",
    title:
      "EntroPrefill: Mitigating Long-Context Quadratic Prefill Latency via Entropy-Guided Sparse Attention",
    authors: ["Bruce Raman", "Aditi Verma", "Ananya Iyer"],
    venue: "arXiv preprint",
    area: "Prefill",
    date: "Dec 2025",
    year: 2025,
    arxiv: "https://arxiv.org/abs/2512.03310",
    arxivLabel: "arXiv:2512.03310",
    code: "https://github.com/bruce12-glitch/ILRL",
    abstract:
      "Entropy-guided pruning of low-information key ranges restores near-linear prefill: 3.1× faster time-to-first-token at 256K context with bounded perplexity drift.",
    selected: true,
  },
  {
    id: "memory-wall-survey",
    title:
      "Beyond the Memory Wall: A Systems Survey of KV-Cache Management for Efficient LLM Serving",
    authors: ["Sara Okonkwo", "Priya Nair", "Marcus Feld"],
    venue: "arXiv preprint",
    area: "Survey",
    date: "Oct 2025",
    year: 2025,
    arxiv: "https://arxiv.org/abs/2510.05241",
    arxivLabel: "arXiv:2510.05241",
    abstract:
      "A systems-taxonomy of paging, quantization, eviction and offload techniques for KV-cache management, with an open benchmark harness.",
  },
  {
    id: "tokens-not-free",
    title:
      "Tokens per Second Are Not Free: Characterizing Throughput-Latency Trade-offs in Continuous-Batch LLM Inference",
    authors: ["Leo Zhang", "Ananya Iyer"],
    venue: "arXiv preprint",
    area: "Systems",
    date: "Jul 2025",
    year: 2025,
    arxiv: "https://arxiv.org/abs/2507.01158",
    arxivLabel: "arXiv:2507.01158",
    abstract:
      "A measurement study across open serving stacks showing where continuous batching wins, where it stalls, and which knobs actually move P99 tail latency.",
  },
  {
    id: "entrocache",
    title: "EntroCache: Entropy-Aware Eviction for Multi-Turn Dialogue KV Reuse",
    authors: ["Aditi Verma", "Bruce Raman"],
    venue: "Systems workshop paper",
    area: "KV-Cache",
    date: "May 2025",
    year: 2025,
    arxiv: "https://arxiv.org/abs/2505.04472",
    arxivLabel: "arXiv:2505.04472",
    abstract:
      "Early lab workshowing attention-entropy outperforms recency heuristics as an eviction signal for multi-turn KV reuse — the seed of Page-EntroKV.",
  },
];

/* ── People ──────────────────────────────────────────────────────────── */

export interface Person {
  name: string;
  role: string;
  focus: string;
  github: string;
  scholar: string;
  tint: "navy" | "gold" | "cream";
  /** alumni only */
  now?: string;
  years?: string;
}

const scholarSearch = (name: string) =>
  `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodeURIComponent(
    `"${name}"`
  )}`;

const gh = (slug: string) => `https://github.com/${slug}`;

export const PEOPLE: {
  faculty: Person[];
  team: Person[];
  alumni: Person[];
} = {
  faculty: [
    {
      name: "Dr. Ananya Iyer",
      role: "Faculty Advisor",
      focus: "LLM systems, sparse attention, ML–systems co-design",
      github: gh("ananya-iyer-sys"),
      scholar: scholarSearch("Ananya Iyer"),
      tint: "navy",
    },
    {
      name: "Dr. Marcus Feld",
      role: "Research Mentor",
      focus: "Serving systems, scheduling, performance modelling",
      github: gh("marcus-feld"),
      scholar: scholarSearch("Marcus Feld"),
      tint: "gold",
    },
  ],
  team: [
    {
      name: "Bruce Raman",
      role: "Founding Researcher · PhD track",
      focus: "Prefill & attention kernels — leads EntroPrefill",
      github: gh("bruce12-glitch"),
      scholar: scholarSearch("Bruce Raman"),
      tint: "navy",
    },
    {
      name: "Priya Nair",
      role: "Researcher",
      focus: "KV-cache compression, quantization kernels",
      github: gh("priya-nair-kv"),
      scholar: scholarSearch("Priya Nair"),
      tint: "cream",
    },
    {
      name: "Leo Zhang",
      role: "Researcher",
      focus: "Continuous batching, scheduling — leads RecLoop",
      github: gh("leo-zhang-serving"),
      scholar: scholarSearch("Leo Zhang"),
      tint: "gold",
    },
    {
      name: "Sara Okonkwo",
      role: "Researcher",
      focus: "Memory orchestration, cold-tier offload",
      github: gh("sara-okonkwo"),
      scholar: scholarSearch("Sara Okonkwo"),
      tint: "cream",
    },
    {
      name: "Aditi Verma",
      role: "Researcher",
      focus: "Cache reuse, dialogue workloads, calibration",
      github: gh("aditi-verma-ml"),
      scholar: scholarSearch("Aditi Verma"),
      tint: "navy",
    },
  ],
  alumni: [
    {
      name: "Tom Reyes",
      role: "Undergraduate researcher",
      focus: "Kernel benchmarking",
      now: "Systems engineer, inference infrastructure",
      years: "2025",
      github: gh("tom-reyes"),
      scholar: scholarSearch("Tom Reyes"),
      tint: "cream",
    },
    {
      name: "Hana Suzuki",
      role: "Visiting researcher",
      focus: "Serving traces & workloads",
      now: "PhD student, computer systems",
      years: "2025",
      github: gh("hana-suzuki"),
      scholar: scholarSearch("Hana Suzuki"),
      tint: "cream",
    },
    {
      name: "Diego Martínez",
      role: "Software engineer",
      focus: "Runtime tooling",
      now: "ML engineer, applied AI team",
      years: "2025",
      github: gh("diego-mtz"),
      scholar: scholarSearch("Diego Martínez"),
      tint: "cream",
    },
  ],
};

/* ── News ────────────────────────────────────────────────────────────── */

export interface NewsItem {
  date: string;
  title: string;
  detail?: string;
  link?: string;
  linkLabel?: string;
}

export const NEWS: NewsItem[] = [
  {
    date: "Mar 2026",
    title: "Page-EntroKV preprint posted and open-sourced",
    detail:
      "Entropy-tiered paged KV-cache compression: −68% cache memory, 2.4× decode throughput at long context.",
    link: "https://arxiv.org/abs/2603.01421",
    linkLabel: "arXiv:2603.01421",
  },
  {
    date: "Feb 2026",
    title: "EntroPrefill reaches 3.1× faster TTFT at 256K context",
    detail:
      "New block-sparse kernel keeps prefill near-linear on H100 systems; code and calibration harness are public.",
    link: "https://github.com/bruce12-glitch/ILRL",
    linkLabel: "Code on GitHub",
  },
  {
    date: "Jan 2026",
    title: "RecLoop v0.3 released with SLO-aware admission control",
    detail:
      "The inference-in-loop scheduler now ships with open traces and reproducible P99 benchmarks.",
  },
  {
    date: "Dec 2025",
    title: "EntroPrefill preprint posted to arXiv",
    detail:
      "Mitigating long-context quadratic prefill latency via entropy-guided sparse attention.",
    link: "https://arxiv.org/abs/2512.03310",
    linkLabel: "arXiv:2512.03310",
  },
  {
    date: "Sep 2025",
    title: "ILRL is founded",
    detail:
      "A remote-first lab for efficient LLM inference and ML systems — inference in loops, recurrence as a first-class systems concern.",
  },
];

export const stats = [
  { value: "3", label: "open-source systems" },
  { value: "6", label: "preprints & papers" },
  { value: "8", label: "researchers & mentors" },
  { value: "100%", label: "code released open" },
];

export const bibtex = (p: Paper) =>
  [
    `@article{${p.id.replace(/-/g, "")},`,
    `  title   = {${p.title}},`,
    `  author  = {${p.authors.join(" and ")}},`,
    `  journal = {${p.venue}},`,
    `  year    = {${p.year}},`,
    `  url     = {${p.arxiv}}`,
    `}`,
  ].join("\n");
