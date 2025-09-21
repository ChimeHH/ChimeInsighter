# Chime Insighter

**A high-performance software component detection and risk analysis tool**  
Developed and released independently by **hhao020** ([www.chime-lab.cn](http://www.chime-lab.cn)), including both frontend and backend.

---

## Overview

Chime Insighter automatically extracts token fingerprints from **source code or binary files**, generates **SBOM (Software Bill of Materials) token databases**, and accurately identifies software components and their exact versions.

It correlates findings with multiple public vulnerability databases, including:
- **NVD** (National Vulnerability Database, USA)
- **JVN** (Japan Vulnerability Notes)
- **CNNVD** (China National Vulnerability Database)
- **CNVD** (China National Vulnerability Platform)

Beyond SBOM and CVE matching, Insighter performs **multi-dimensional risk analysis**, including:
- Compliance with multiple coding standards
- Certificate validity detection
- System configuration hardening checks
- Software Hardening validation
- Detection of various information leakage risks

**Bonus features**:
- Calculate open-source code usage ratio
- Measure proprietary code ratio

---

## Dual Licensing: AGPL + Commercial

In addition to the **AGPL-licensed open-source version**, Insighter is also available under a **commercial license**.

### Commercial Edition Advantages:

- **Zero-Day Vulnerability Mining**: Proactively discover unknown threats
- **Machine Learning & Decision Tree Enhanced Risk Analysis**: Significantly reduce false positives
  - e.g., filters out ~90% of low-risk information leakage alerts
- Priority support, private SBOM databases, and custom integrations

> *Compared to commercial alternatives like Synopsys Black Duck, Insighter offers unique technical advantages — see below.*

---

## Technical Advantages

1. **Configurable Pipeline Architecture**  
   Enable/disable scanning engines on demand — ideal for low-resource environments.

2. **Elastic Deployment via Docker**  
   Supports single-node or multi-node deployment. Easily scalable with Kubernetes.

3. **Low Hardware Requirements**  
   Runs smoothly on hosts with **< 32GB RAM** (excluding Zero-Day module).  
   → Most competitors require 128GB–256GB RAM.

4. **Open & Automated SBOM Generation**  
   No manual component tagging needed. Supports automated ingestion from:
   - GitHub, PyPI, Maven, etc. via scripts
   - Direct database import
   - User-defined component addition

5. **Unknown Vulnerability Detection**  
   Uses deep computation to detect 20+ OWASP-defined high-risk patterns:
   - Stack/buffer overflows
   - Deadlocks
   - Memory corruption
   - And more

6. **High Accuracy via AI & Statistics**  
   - Statistical component/version matching
   - Decision tree + ML filtering for low-risk alerts
   - LLM-generated contextual rules for public CVE filtering

---

## ⚠️ Limitations

Due to market conditions and limited funding, **Chime-Lab is unable to provide continuous feature development or UI optimization**:

- Web interface is functional but not user-friendly
- New component ingestion and AI verification are currently **frozen** due to lack of compute resources

✅ However, Insighter still **excellently serves most real-world use cases**.  
✅ Our SBOM database remains **more comprehensive** than many commercial alternatives.

**We warmly welcome collaborators — contact us for partnership opportunities.**

---

## Important Legal & Usage Notes

### Regarding AGPL License

The open-source version uses **BANG** as its core file processing engine (supports multiple formats, template-based, high-precision parsing).  
BANG is licensed under **AGPL**.

To avoid AGPL "infecting" your code:

- ❌ Do NOT directly link to or import BANG
- ❌ Do NOT establish direct IPC/RPC communication with BANG
- ✅ We invoke BANG **via command-line** and only read its **output files** — this isolates AGPL contagion

> **SaaS Deployment Warning**: Even with CLI isolation, SaaS/cloud deployment remains legally high-risk under AGPL.  
> → Avoid cloud deployment, or replace BANG with a permissively licensed alternative.

Update:
According to the latest udpate, BANG was updated to GPL-3.0, and you may safely deploy Insighter in SaaS or cloud environments without triggering GPL’s source distribution requirement — as long as you do not distribute modified binaries of BANG itself. We only distribute source code of BANG.

---

## Cloud / Cluster Deployment Guide

For large-scale or clustered scanning:

1. **Database Architecture**  
   Use **1 master + multiple read replicas**  
   → Configure “nearest replica first” + random fallback for load balancing

2. **Performance Optimization**  
   Partition and shard SBOM tables (`tokens`, `files`) to:
   - Improve query efficiency
   - Reduce hardware requirements

---

## Firewall & Security

Insighter is **not designed with built-in security hardening**.

✅ **You MUST enable a firewall** for production use.

📁 Firewall startup scripts are included in the installation package — run as-is or customize for your environment.

---

## Download & Installation

### Software Packages & SBOM Database (Distilled for Automotive)

🔗 [Download Here](https://drive.google.com/drive/folders/1yu0RLo-WtEQPLQ2k9MPhPFy8LlZV-_sT?usp=drive_link)

> 💡 *This SBOM library is a distilled version (~3,000 common components) for automotive use.  
> For enterprise-grade full SBOM database, please contact us.*

### Full Container Images (for complex environments)

🔗 [Download Docker Images & Tools](https://drive.google.com/drive/folders/1CGB3mqm8XQ4RJZlHv-NIyWe-fpJITldt?usp=drive_link)

✅ After installation, you can replace any module with your own source code for testing.

---

## Contact & Collaboration

📧 For commercial licensing, full SBOM database, or technical collaboration:  
→ **hhao020@gmail.com**

🌐 Official Site: [www.chime-lab.cn](http://www.chime-lab.cn)
