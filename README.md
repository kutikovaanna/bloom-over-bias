# Bloom Over Bias

**AI-powered tool for UX researchers to detect hidden biases in interview guides and surveys** — leading questions, assumptions, jargon, order bias, and more. Get a neutrality score and an improved version in one click.

Built with React + Claude AI (Anthropic). Supports English, Czech, and German.

<img width="1456" height="902" alt="Snímek obrazovky 2026-06-21 v 15 39 30" src="https://github.com/user-attachments/assets/93a67594-2392-40b4-9ac4-11615f9b09a4" />


## How it works

Paste your discussion guide or survey, pick the type, and click **Bloom it**. The tool analyzes every question and returns a side-by-side original vs. improved version, a neutrality score, detailed findings, and actionable recommendations.

### Side-by-side rewrite

Your original guide on the left, an improved version on the right — copy the cleaned-up version with one click.

<!-- SEM PŘETÁHNI: Image 2 (split view original vs improved) -->

### Detailed findings

Every flagged question comes with an explanation of why it matters and a concrete before/after rewrite.

<!-- SEM PŘETÁHNI: Image 3 (rozkliknuté nálezy s before/after) -->

### Score & recommendations

A neutrality score (0–100), a breakdown of detected bias types, and tailored recommendations specific to your guide.

<!-- SEM PŘETÁHNI: Image 4 (score ring + recommendations) -->

## Features

- Detects 11 bias types: leading, double-barreled, assumption-loaded, jargon, social desirability, vague, order bias, framing, hypothetical, validation-seeking
- Neutrality score (0–100)
- Before/after comparison for every finding
- Actionable, guide-specific recommendations
- Export report as .txt
- Dark mode
- EN / CS / DE

## Tech stack

- React + Vite
- Claude API (Anthropic) for bias analysis

---

vibecoded by [Anna Kutíková](https://www.linkedin.com/in/anna-kutikova/) ✳<img width="1454" height="902" alt="Snímek obrazovky 2026-06-21 v 15 38 58" src="https://github.com/user-attachments/assets/a99b80b4-bfe9-435b-9091-36d4739265eb" />
