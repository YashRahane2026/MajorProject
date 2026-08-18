# CrimeTrack AI - Data Pipeline

This directory contains the data generation pipeline for the CrimeTrack AI platform.

## Synthetic Data Methodology

### Why Synthetic Data?
Real criminal records, First Information Reports (FIRs), and mugshots are highly sensitive and subject to strict privacy regulations. Due to ethical constraints, lack of access to real criminal databases, and the need to publicly demonstrate and evaluate the platform, we utilize completely synthetic data for both faces and incident reports.

This approach allows us to:
1.  **Test System Components Safely:** Validate our AI models (Facenet, Sentence-BERT) without risking PII exposure.
2.  **Control Ground Truth:** We can deliberately inject near-duplicate cases and specific aliases to evaluate the accuracy of our similarity search algorithms.
3.  **Ensure Compliance:** Maintain strict adherence to data privacy laws while building a robust prototype.

### Face Generation Methodology
We use the Labeled Faces in the Wild (LFW) dataset as our base source of diverse facial images.
*   **Source:** `sklearn.datasets.fetch_lfw_people` (Original LFW dataset)
*   **Relabeling:** We use the `faker` library to assign synthetic names to the real identities in the LFW dataset, creating a new set of "suspects".
*   **Alias Creation:** To simulate scenarios where a suspect uses multiple aliases, we group different LFW images of the same real person under one primary synthetic identity and generate alias names for the variants.
*   **Augmentation:** For identities with only a single image, we apply slight data augmentations (rotation, horizontal flip, brightness adjustment) to create artificial variants, ensuring every synthetic suspect has multiple images to test face matching robustness.

### FIR Text Generation Methodology
We generate a synthetic corpus of FIRs (First Information Reports) simulating Indian law enforcement records.
*   **Template-Based Approach:** We use a predefined set of Modus Operandi (MO) templates covering various crime types (theft, robbery, assault, cyber fraud, etc.).
*   **Slot Filling:** We utilize `faker` (configured for Indian locales where appropriate) to fill in details like complainant names, addresses, incident dates, and specific locations (e.g., landmarks, street names).
*   **Near-Duplicate Clusters (For Testing Similarity):** A critical feature of this pipeline is the creation of "MO Clusters". For a given base MO narrative, we generate 3-5 variations with slightly different wording, synonymous terms, or minor circumstantial changes. These variations share the same core MO and belong to the same cluster. This allows us to rigorously test the Sentence-BERT model and vector database's ability to link conceptually related but textually different incident reports.

## Data Provenance
*   **Facial Images:** Derived from the Labeled Faces in the Wild (LFW) dataset, a public benchmark for face verification.
*   **Names and Addresses:** Generated using the Python `faker` library.
*   **Narratives:** Generated via programmatic templates designed to mimic typical incident report structures.
*   **No Real Criminal Data:** Absolutely no real-world crime data, active police records, or sensitive personal information are included in this generated dataset.
