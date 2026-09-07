# Production-Style Microservices Deployment Platform

A production-style microservices deployment platform demonstrating containerization, Kubernetes orchestration, CI/CD automation, reverse proxy configuration, and centralized observability.

## Project Status

🚧 Project is currently under development.

## Planned Architecture

Internet
   ↓
NGINX
   ↓
Frontend
   ↓
Backend API
   ↓
Database

Observability:
Prometheus → Grafana
Application/Container Logs → Loki

## Technology Stack

- Docker
- Docker Compose
- Kubernetes
- Helm
- Ingress
- ConfigMaps
- Secrets
- NGINX
- GitHub Actions
- Prometheus
- Grafana
- Loki
- AWS

## Repository Structure

```text
production-style-microservices-platform/
├── frontend/
├── backend/
├── database/
├── docker/
├── kubernetes/
├── helm/
├── monitoring/
├── docs/
├── screenshots/
├── github-actions/
├── .gitignore
└── README.md
