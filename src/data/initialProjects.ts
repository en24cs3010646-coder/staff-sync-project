import { Project } from '../types/project';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-medivision-ai',
    title: 'MediVision AI - Pathology Assistant',
    subtitle: 'Deep learning diagnostic assistant for cellular histopathology slide analysis',
    description: 'An AI-powered clinical decision support system utilizing convolutional neural networks and vision transformers to identify tissue anomalies in microscopic biopsy scans with high confidence and heatmap visualization.',
    category: 'AI & Machine Learning',
    status: 'in-progress',
    priority: 'high',
    progress: 74,
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'OpenCV', 'TailwindCSS', 'Docker'],
    repositoryUrl: 'https://github.com/example/medivision-ai',
    demoUrl: 'https://medivision-demo.example.org',
    documentationUrl: 'https://docs.medivision.example.org',
    targetDate: '2026-12-15',
    createdDate: '2026-08-10',
    lastUpdated: '2026-10-25',
    isFavorite: true,
    author: {
      name: 'Dr. Aarav Sharma & Team',
      role: 'Lead ML Researcher',
      institution: 'Medi-Caps University / CS Lab',
    },
    collaborators: [
      { id: 'c1', name: 'Aarav Sharma', role: 'Model Architect', email: 'aarav.sharma@medicaps.ac.in' },
      { id: 'c2', name: 'Priya Patel', role: 'Full-Stack Developer', email: 'priya.patel@medicaps.ac.in' },
      { id: 'c3', name: 'Rohan Verma', role: 'Data Engineer', email: 'rohan.verma@medicaps.ac.in' },
    ],
    metrics: [
      { label: 'Validation Accuracy', value: '96.4%', change: '+1.8% vs baseline' },
      { label: 'Inference Latency', value: '185 ms', change: 'GPU accelerated' },
      { label: 'Dataset Size', value: '45,000 slides', change: 'Multi-center cohort' },
      { label: 'F1 Score', value: '0.948', change: 'Micro-average' },
    ],
    milestones: [
      { id: 'm1', title: 'Data Preprocessing & Normalization Pipeline', dueDate: '2026-08-30', completed: true, description: 'Hematoxylin and Eosin (H&E) stain color deconvolution normalization.' },
      { id: 'm2', title: 'Vision Transformer Backbone Training', dueDate: '2026-09-25', completed: true, description: 'Pre-trained ViT fine-tuning on Camelyon16 & TCGA datasets.' },
      { id: 'm3', title: 'Grad-CAM Interpretability Engine', dueDate: '2026-10-18', completed: true, description: 'Heatmap activation generation for explainable AI clinical review.' },
      { id: 'm4', title: 'Real-time Web DICOM Viewer Integration', dueDate: '2026-11-10', completed: false, description: 'Cornerstone.js integration for gigapixel whole slide imaging.' },
      { id: 'm5', title: 'Clinical Trial Simulation & Audit', dueDate: '2026-12-05', completed: false, description: 'Blinded cross-validation with practicing pathologists.' },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Optimize inference batch size on TensorRT',
        description: 'Convert PyTorch weights to ONNX and profile TensorRT FP16 quantization.',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-10-30',
        assignee: 'Aarav Sharma',
        tags: ['Performance', 'Inference'],
      },
      {
        id: 't2',
        title: 'Build DICOM slide zoom & pan canvas',
        description: 'Support multi-resolution tile loading without blocking main thread.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2026-11-04',
        assignee: 'Priya Patel',
        tags: ['Frontend', 'Canvas'],
      },
      {
        id: 't3',
        title: 'Export Grad-CAM overlays as GeoJSON contours',
        description: 'Allows pathologists to toggle diagnostic masks over tissue regions.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-11-08',
        assignee: 'Rohan Verma',
        tags: ['AI/ML', 'Visualization'],
      },
      {
        id: 't4',
        title: 'Set up HIPAA-compliant mock audit logging',
        description: 'Verify access logs and anonymization of patient identifiers.',
        status: 'done',
        priority: 'urgent',
        dueDate: '2026-10-15',
        assignee: 'Priya Patel',
        tags: ['Security', 'Compliance'],
      },
    ],
    documentation: `# MediVision AI: Histopathology Diagnostic Assistant

## 1. Abstract
MediVision AI is an end-to-end computer vision framework designed to assist pathologists in detecting early-stage micro-metastases in lymph node biopsies. By coupling a fine-tuned Swin Transformer backbone with attention-driven patch aggregators, the system achieves pathologist-level sensitivity while cutting review time by 60%.

## 2. System Architecture
- **Input Layer:** Multi-scale Whole Slide Images (WSI) ingested via OpenSlide.
- **Tiling & Patch Extraction:** 256x256 non-overlapping tissue tiles sampled at 20x magnification.
- **Feature Extractor:** Swin-B Transformer generating 1024-dimensional spatial embeddings.
- **Aggregation Head:** Attention-based Multiple Instance Learning (CLAM) pooling.
- **API & Client:** FastAPI serving asynchronous inference jobs; React 19 UI with WebGL tile renderer.

## 3. Key Results & Validation
- **Sensitivity:** 97.2% on micro-metastatic lesions (< 2mm).
- **Specificity:** 95.8% across negative control tissue samples.
- **Inference Speed:** Average 1.4 minutes per Whole Slide Image (40,000 x 30,000 px).

## 4. Setup & Quickstart
\`\`\`bash
# Clone the repository
git clone https://github.com/example/medivision-ai.git
cd medivision-ai

# Install dependencies and start server
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
\`\`\`
`,
    codeSnippets: [
      {
        id: 'cs1',
        filename: 'model_pipeline.py',
        language: 'python',
        description: 'Patch feature aggregation with attention-weighted MIL',
        code: `import torch
import torch.nn as nn

class AttentionMIL(nn.Module):
    def __init__(self, in_features=1024, hidden_dim=256, num_classes=2):
        super().__init__()
        self.attention = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, 1)
        )
        self.classifier = nn.Linear(in_features, num_classes)

    def forward(self, patch_embeddings):
        # patch_embeddings shape: [Batch, Num_Patches, 1024]
        weights = self.attention(patch_embeddings) # [B, N, 1]
        normalized_weights = torch.softmax(weights, dim=1)
        slide_repr = torch.sum(patch_embeddings * normalized_weights, dim=1)
        logits = self.classifier(slide_repr)
        return logits, normalized_weights`,
      },
      {
        id: 'cs2',
        filename: 'api_inference.py',
        language: 'python',
        description: 'FastAPI endpoint for asynchronous WSI tile inference',
        code: `@router.post("/analyze-slide")
async def analyze_slide(
    slide_file: UploadFile = File(...),
    threshold: float = 0.85
):
    job_id = str(uuid.uuid4())
    temp_path = f"/tmp/{job_id}_{slide_file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await slide_file.read())
    
    # Trigger background worker
    celery_app.send_task("tasks.process_wsi", args=[job_id, temp_path, threshold])
    return {"status": "queued", "job_id": job_id, "estimated_duration": "90s"}`,
      },
    ],
    resources: [
      {
        id: 'r1',
        title: 'Camelyon16 Challenge Benchmark',
        url: 'https://camelyon16.grand-challenge.org/',
        type: 'dataset',
        description: 'Annotated reference dataset for sentinel lymph node metastasis detection.',
      },
      {
        id: 'r2',
        title: 'CLAM: Data-Efficient Whole Slide Pathology (Nature BME)',
        url: 'https://nature.com/articles/s41551-020-00682-w',
        type: 'paper',
        description: 'Foundational paper on attention-based multiple instance learning.',
      },
      {
        id: 'r3',
        title: 'CornerstoneJS Medical Imaging SDK',
        url: 'https://cornerstonejs.org/',
        type: 'documentation',
        description: 'Interactive high-performance DICOM & WebGL viewer library.',
      },
    ],
  },
  {
    id: 'proj-campusconnect',
    title: 'CampusConnect - Academic Hub & Mentorship',
    subtitle: 'Unified platform for student project collaboration, peer review, and faculty guidance',
    description: 'A comprehensive campus ecosystem connecting university students with peer project partners, research mentors, and past project repositories with integrated chat, skill-matching algorithms, and verified badges.',
    category: 'Academic Capstone',
    status: 'in-progress',
    priority: 'high',
    progress: 88,
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'Prisma', 'Socket.io', 'Redis'],
    repositoryUrl: 'https://github.com/example/campus-connect',
    demoUrl: 'https://campusconnect-preview.example.edu',
    targetDate: '2026-11-20',
    createdDate: '2026-07-15',
    lastUpdated: '2026-10-24',
    isFavorite: true,
    author: {
      name: 'Aditya K. & Team Medi-Caps',
      role: 'Project Lead',
      institution: 'Faculty of Engineering, Medi-Caps',
    },
    collaborators: [
      { id: 'c4', name: 'Aditya Kulkarni', role: 'Full Stack Lead', email: 'aditya.k@medicaps.ac.in' },
      { id: 'c5', name: 'Sneha Jain', role: 'UI/UX Designer', email: 'sneha.j@medicaps.ac.in' },
      { id: 'c6', name: 'Manish Rawat', role: 'Backend & DB Architect', email: 'manish.r@medicaps.ac.in' },
    ],
    metrics: [
      { label: 'Active Students', value: '1,420+', change: '3 campus departments' },
      { label: 'Saved Projects', value: '380+', change: 'All engineering disciplines' },
      { label: 'Mentorship Matches', value: '215', change: '89% satisfaction rating' },
      { label: 'Avg Peer Review', value: '4.8 / 5', change: 'Faculty verified' },
    ],
    milestones: [
      { id: 'cc-m1', title: 'Student Authentication via Institute SSO', dueDate: '2026-08-15', completed: true, description: 'Google Workspace OAuth domain lock to @medicaps.ac.in.' },
      { id: 'cc-m2', title: 'Skill Vector Similarity Matching Engine', dueDate: '2026-09-10', completed: true, description: 'Cosine similarity on tech stack tags and project interests.' },
      { id: 'cc-m3', title: 'Live Chat & Collaborative Channels', dueDate: '2026-10-05', completed: true, description: 'Socket.io real-time chat with file attachments and code block sharing.' },
      { id: 'cc-m4', title: 'Faculty Grading & Viva Evaluation Portal', dueDate: '2026-11-05', completed: false, description: 'Rubric-based assessment scoring and automated project report generation.' },
    ],
    tasks: [
      {
        id: 'cct-1',
        title: 'Build automated PDF report export for project viva',
        description: 'Generate standard college project cover page, certificate, synopsis, and rubric score sheet.',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-10-28',
        assignee: 'Aditya Kulkarni',
        tags: ['Reports', 'PDF'],
      },
      {
        id: 'cct-2',
        title: 'Implement Dark / Light mode theme persistence',
        description: 'Sync system preference with localStorage and user profile settings.',
        status: 'done',
        priority: 'low',
        dueDate: '2026-10-20',
        assignee: 'Sneha Jain',
        tags: ['UI/UX'],
      },
      {
        id: 'cct-3',
        title: 'Add plagiarism checker integration for synopsis',
        description: 'Verify project synopsis uniqueness against existing college database.',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-11-02',
        assignee: 'Manish Rawat',
        tags: ['Backend', 'Security'],
      },
    ],
    documentation: `# CampusConnect: Academic Project Collaboration Hub

## Project Overview
CampusConnect solves the fragmentation of academic mini and major projects in engineering universities. Students frequently duplicate past year projects without visibility, struggle to form cross-disciplinary teams, and lack a persistent showcase for placements.

## Core Capabilities
1. **Curated Project Repository:** Searchable index of department projects categorized by semester, tech stack, and faculty guide.
2. **Team Formation Matchmaker:** Automatic recommendations based on complementary skill sets (e.g., matching a Frontend specialist with an ML researcher).
3. **Faculty Milestone Tracking:** Pre-scheduled review checkpoints (Synopsis Submission, Mid-term Evaluation, Final Viva) with inline rubrics.
`,
    codeSnippets: [
      {
        id: 'cs-cc1',
        filename: 'matcher.ts',
        language: 'typescript',
        description: 'Cosine similarity score calculation for student project matchmaking',
        code: `export function calculateSkillCompatibility(
  studentSkills: string[],
  projectRequiredSkills: string[]
): number {
  if (projectRequiredSkills.length === 0) return 1.0;
  
  const studentSet = new Set(studentSkills.map(s => s.toLowerCase().trim()));
  const matches = projectRequiredSkills.filter(req => 
    studentSet.has(req.toLowerCase().trim())
  );
  
  const score = matches.length / projectRequiredSkills.length;
  return Math.round(score * 100);
}`,
      },
    ],
    resources: [
      {
        id: 'r-cc1',
        title: 'National Board of Accreditation (NBA) Capstone Guidelines',
        url: 'https://nbaind.org',
        type: 'documentation',
        description: 'Evaluation criteria and outcome-based education parameters.',
      },
    ],
  },
  {
    id: 'proj-ecosense-iot',
    title: 'EcoSense - Smart Agricultural IoT Mesh',
    subtitle: 'LoRaWAN distributed wireless sensor network for precision soil moisture & automated drip irrigation',
    description: 'An autonomous low-power IoT network monitoring volumetric water content, soil temperature, and ambient microclimate across multi-acre farmland to trigger solar-powered irrigation valves dynamically.',
    category: 'IoT & Embedded',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    techStack: ['C++', 'ESP32', 'LoRaWAN', 'MQTT', 'Node-RED', 'InfluxDB', 'Grafana', 'React'],
    repositoryUrl: 'https://github.com/example/ecosense-iot',
    targetDate: '2026-09-30',
    createdDate: '2026-05-12',
    lastUpdated: '2026-10-14',
    isFavorite: false,
    author: {
      name: 'Vikram Joshi & IoT Lab',
      role: 'Embedded Systems Specialist',
      institution: 'Medi-Caps IoT Innovation Centre',
    },
    collaborators: [
      { id: 'c7', name: 'Vikram Joshi', role: 'Firmware Engineer', email: 'vikram.j@medicaps.ac.in' },
      { id: 'c8', name: 'Neha Gupta', role: 'Cloud & Telemetry', email: 'neha.g@medicaps.ac.in' },
    ],
    metrics: [
      { label: 'Water Savings', value: '38.5%', change: 'Compared to timer irrigation' },
      { label: 'Node Battery Life', value: '18 Months', change: 'Deep sleep duty cycle' },
      { label: 'Transmission Range', value: '4.2 km', change: 'Line-of-sight LoRa 868MHz' },
      { label: 'Packet Delivery', value: '99.1%', change: 'Mesh relay active' },
    ],
    milestones: [
      { id: 'es-m1', title: 'ESP32 Deep Sleep & Soil Sensor Calibration', dueDate: '2026-06-15', completed: true, description: 'Calibrated capacitive sensor against gravimetric soil moisture benchmarks.' },
      { id: 'es-m2', title: 'LoRaWAN Gateway Setup on 868 MHz Band', dueDate: '2026-07-20', completed: true, description: 'The Things Network (TTN) cloud connector with ChirpStack backup.' },
      { id: 'es-m3', title: 'Solar Valve Actuator Relay Hardware', dueDate: '2026-08-18', completed: true, description: 'H-bridge latching solenoid valve driver circuit.' },
      { id: 'es-m4', title: 'Field Testing & Pilot Deployment', dueDate: '2026-09-25', completed: true, description: '5-acre sugarcane test farm pilot over 60 continuous days.' },
    ],
    tasks: [
      {
        id: 'est-1',
        title: 'Document PCB schematics and BOM list',
        description: 'Clean up KiCad schematics and export Gerber files for open-hardware submission.',
        status: 'done',
        priority: 'medium',
        dueDate: '2026-10-05',
        assignee: 'Vikram Joshi',
        tags: ['Hardware', 'PCB'],
      },
    ],
    documentation: `# EcoSense: Precision Agriculture IoT Mesh

## Executive Summary
EcoSense provides an affordable, open-hardware IoT telemetric architecture for water-scarce agrarian regions. Utilizing capacitive soil moisture sensors and long-range LoRa radios, nodes transmit microclimate readings every 15 minutes to a central gateway powered by a 5W solar cell.

## Hardware Specifications
- **Microcontroller:** ESP32-WROOM-32 with Ultra Low Power (ULP) co-processor.
- **Transceiver:** Semtech SX1276 LoRa module running at 868 MHz ISM band.
- **Sensors:** Capacitive Soil Moisture v1.2, DS18B20 soil temperature, BME280 barometric/humidity.
- **Power Supply:** 3.7V 2600mAh 18650 Li-ion battery with TP4056 charge controller.
`,
    codeSnippets: [
      {
        id: 'cs-es1',
        filename: 'node_firmware.cpp',
        language: 'cpp',
        description: 'ESP32 deep sleep routine with capacitive soil reading and LoRa transmit',
        code: `#include <SPI.h>
#include <LoRa.h>

#define SOIL_PIN 34
#define SLEEP_SECONDS 900 // 15 mins

RTC_DATA_ATTR int bootCount = 0;

void setup() {
  bootCount++;
  int rawValue = analogRead(SOIL_PIN);
  float moisturePct = map(rawValue, 3200, 1400, 0, 100);
  moisturePct = constrain(moisturePct, 0.0, 100.0);

  LoRa.begin(868E6);
  LoRa.setTxPower(20);
  
  LoRa.beginPacket();
  LoRa.print("NODE_01;B=");
  LoRa.print(bootCount);
  LoRa.print(";M=");
  LoRa.print(moisturePct, 2);
  LoRa.endPacket();

  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * 1000000ULL);
  esp_deep_sleep_start();
}`,
      },
    ],
    resources: [
      {
        id: 'r-es1',
        title: 'ChirpStack Open Source LoRaWAN Network Server',
        url: 'https://chirpstack.io',
        type: 'documentation',
        description: 'Network server architecture for private IoT gateways.',
      },
    ],
  },
  {
    id: 'proj-apexcloud',
    title: 'ApexCloud - Microservices Orchestration Mesh',
    subtitle: 'High-throughput event-driven microservice dispatch engine with distributed tracing',
    description: 'An enterprise cloud architecture featuring automated service discovery, zero-downtime canary deployments, circuit breakers, and sub-millisecond OpenTelemetry trace propagation across heterogeneous microservices.',
    category: 'Cloud & DevOps',
    status: 'review',
    priority: 'urgent',
    progress: 92,
    techStack: ['Go', 'Kubernetes', 'Docker', 'gRPC', 'Redis', 'Prometheus', 'Grafana', 'Envoy'],
    repositoryUrl: 'https://github.com/example/apexcloud-mesh',
    demoUrl: 'https://apexcloud.example.io',
    targetDate: '2026-11-15',
    createdDate: '2026-06-01',
    lastUpdated: '2026-10-26',
    isFavorite: false,
    author: {
      name: 'DevOps Engineering Group',
      role: 'Platform Architect',
    },
    collaborators: [
      { id: 'c9', name: 'Kavita Menon', role: 'Cloud Architect', email: 'kavita.m@example.com' },
      { id: 'c10', name: 'Tanmay Saxena', role: 'Site Reliability Engineer', email: 'tanmay.s@example.com' },
    ],
    metrics: [
      { label: 'Throughput', value: '42,000 req/s', change: 'Benchmark on 8 nodes' },
      { label: 'P99 Latency', value: '4.8 ms', change: 'Internal gRPC routes' },
      { label: 'Error Rate', value: '0.002%', change: 'Under synthetic stress' },
      { label: 'Memory Footprint', value: '34 MB', change: 'Per proxy sidecar' },
    ],
    milestones: [
      { id: 'ap-m1', title: 'gRPC Protocol Buffers Contract Definition', dueDate: '2026-06-30', completed: true, description: 'Unified proto specifications for auth, telemetry, and payment routes.' },
      { id: 'ap-m2', title: 'Custom Kubernetes CRD & Controller in Go', dueDate: '2026-08-15', completed: true, description: 'Controller watching custom ServiceMeshRoute CRDs.' },
      { id: 'ap-m3', title: 'Canary Traffic Splitting with Envoy Filter', dueDate: '2026-09-20', completed: true, description: 'Percentage-based weighted routing without restarting pods.' },
      { id: 'ap-m4', title: 'Security Hardening & Penetration Audit', dueDate: '2026-10-31', completed: false, description: 'mTLS certificate rotation and RBAC policy verification.' },
    ],
    tasks: [
      {
        id: 'apt-1',
        title: 'Run Chaos Engineering test with Chaos Mesh',
        description: 'Simulate 20% packet loss on ingress gateway and verify graceful degradation.',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: '2026-10-28',
        assignee: 'Tanmay Saxena',
        tags: ['SRE', 'Chaos'],
      },
      {
        id: 'apt-2',
        title: 'Benchmark memory consumption under 100k open WebSockets',
        description: 'Verify goroutine pool allocation and garbage collection pauses.',
        status: 'review',
        priority: 'high',
        dueDate: '2026-10-27',
        assignee: 'Kavita Menon',
        tags: ['Go', 'Benchmark'],
      },
    ],
    documentation: `# ApexCloud: Cloud-Native Microservices Orchestrator

## Overview
ApexCloud is designed for engineering teams needing resilient, low-overhead inter-service communication without the heavyweight complexity of traditional Istio deployments. Written entirely in Go and integrated directly with the Kubernetes API.

## Core Features
- **Instant Discovery:** Direct DNS and EndpointSlice watching for instant route updates.
- **Adaptive Rate Limiting:** Leaky bucket rate limiter backed by in-memory Redis clusters.
- **OpenTelemetry Native:** B3 and W3C trace context injected automatically into all outbound headers.
`,
    codeSnippets: [
      {
        id: 'cs-ap1',
        filename: 'controller.go',
        language: 'go',
        description: 'Kubernetes Controller reconciling ServiceMeshRoute CRD',
        code: `package controller

import (
    "context"
    "fmt"
    v1 "k8s.io/api/core/v1"
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/reconcile"
)

type RouteReconciler struct {
    Client client.Client
}

func (r *RouteReconciler) Reconcile(ctx context.Context, req reconcile.Request) (reconcile.Result, error) {
    var service v1.Service
    if err := r.Client.Get(ctx, req.NamespacedName, &service); err != nil {
        return reconcile.Result{}, client.IgnoreNotFound(err)
    }

    fmt.Printf("ApexCloud: Synced routing rules for service %s\\n", service.Name)
    return reconcile.Result{}, nil
}`,
      },
    ],
    resources: [
      {
        id: 'r-ap1',
        title: 'Kubernetes Controller Runtime Docs',
        url: 'https://github.com/kubernetes-sigs/controller-runtime',
        type: 'documentation',
        description: 'Reference library for building Go Kubernetes controllers.',
      },
    ],
  },
  {
    id: 'proj-cryptoshield',
    title: 'CryptoShield - Zero-Knowledge Transaction Verifier',
    subtitle: 'zk-SNARK privacy preservation protocol for verifiable academic credential verification',
    description: 'An advanced cryptographic protocol enabling students and universities to verify degree credentials, GPA milestones, and course certifications without disclosing confidential transcripts or personal identifying numbers.',
    category: 'Cybersecurity',
    status: 'planning',
    priority: 'medium',
    progress: 35,
    techStack: ['Rust', 'Circom', 'Solidity', 'SnarkJS', 'Next.js', 'Ethers.js', 'WebAssembly'],
    repositoryUrl: 'https://github.com/example/cryptoshield-zk',
    targetDate: '2027-01-20',
    createdDate: '2026-09-01',
    lastUpdated: '2026-10-22',
    isFavorite: false,
    author: {
      name: 'Cybersecurity Research Unit',
      role: 'Cryptography Lead',
    },
    collaborators: [
      { id: 'c11', name: 'Zoya Khan', role: 'ZK Circuit Engineer', email: 'zoya.k@example.org' },
    ],
    metrics: [
      { label: 'Proof Gen Time', value: '1.2s', change: 'WASM in browser' },
      { label: 'On-chain Gas', value: '235k gas', change: 'Ethereum / Polygon verify' },
      { label: 'Circuit Constraints', value: '14,200', change: 'Groth16 optimized' },
    ],
    milestones: [
      { id: 'cs-m1', title: 'Circom Arithmetic Circuits Definition', dueDate: '2026-10-15', completed: true, description: 'Merkle tree membership and hash preimage proof circuit.' },
      { id: 'cs-m2', title: 'Groth16 Trusted Setup Ceremony', dueDate: '2026-11-15', completed: false, description: 'Powers of Tau ceremony generation and verification key export.' },
      { id: 'cs-m3', title: 'Solidity Smart Contract Verifier Deployment', dueDate: '2026-12-10', completed: false, description: 'EVM verifier contract tested on Sepolia testnet.' },
    ],
    tasks: [
      {
        id: 'cst-1',
        title: 'Benchmark client-side proof generation on mobile safari',
        description: 'Profile WASM memory overhead and multi-threading using Web Workers.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-11-05',
        assignee: 'Zoya Khan',
        tags: ['WASM', 'ZK-Proofs'],
      },
    ],
    documentation: `# CryptoShield: Zero-Knowledge Academic Credentials

## Core Concept
Traditional academic verification requires universities to grant third parties full access to transcripts or rely on centralized verification databases. CryptoShield utilizes zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) to prove statements like:
- "Student holds an accredited Bachelor's Degree in Computer Science"
- "Student cumulative GPA is strictly above 3.5"
...WITHOUT disclosing identity numbers, birth date, individual semester marks, or specific course grades.
`,
    codeSnippets: [
      {
        id: 'cs-zk1',
        filename: 'credential_check.circom',
        language: 'circom',
        description: 'Circom circuit proving GPA threshold without revealing exact value',
        code: `pragma circom 2.0.0;

include "comparators.circom";
include "poseidon.circom";

template VerifyGPAScore() {
    signal input actualGPA;        // Private input: e.g. 385 (for 3.85)
    signal input thresholdGPA;     // Public input: e.g. 350 (for 3.50)
    signal input salt;             // Private salt
    signal output commitmentHash;  // Public commitment
    signal output isEligible;      // 1 if eligible, 0 otherwise

    // Compute commitment
    component hasher = Poseidon(2);
    hasher.inputs[0] <== actualGPA;
    hasher.inputs[1] <== salt;
    commitmentHash <== hasher.out;

    // Compare
    component comp = GreaterEqThan(16);
    comp.in[0] <== actualGPA;
    comp.in[1] <== thresholdGPA;
    isEligible <== comp.out;
}

component main {public [thresholdGPA]} = VerifyGPAScore();`,
      },
    ],
    resources: [
      {
        id: 'r-zk1',
        title: 'Circom 2.0 Documentation',
        url: 'https://docs.circom.io',
        type: 'documentation',
        description: 'Circuit compiler and domain-specific language for zk-SNARKs.',
      },
    ],
  },
];
