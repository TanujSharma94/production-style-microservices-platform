# CI/CD (GitHub Actions)

GitHub only runs workflows from `.github/workflows/`. This folder documents the pipeline.

Workflow: `.github/workflows/ci-cd.yml`

| Job | Runs on | What it does |
|---|---|---|
| backend | PR + push | `npm ci`, syntax check of every `.js` file, informational `npm audit` |
| frontend | PR + push | `npm ci`, `npm run lint`, `npm run build`, informational `npm audit` |
| helm | PR + push | `helm lint`, `helm template`, and checks the chart refuses to render without `secrets.jwtSecret` |
| docker | PR + push | validates `docker-compose.yml`, builds all 3 images, runs `nginx -t` |
| publish | push to `main` only | builds and pushes the 3 images to GHCR (`ghcr.io/<owner>/ecommerce-*`) tagged with the commit SHA and `latest` |

## Security model

- Default token permission is `contents: read`. Only `publish` gets `packages: write`.
- Pull requests (including from forks) use the `pull_request` event: no secrets, read-only token, and no publishing.
- Only GitHub-owned actions are used (`actions/checkout`, `actions/setup-node`). Dependabot keeps them updated.
- No credentials are stored in the repository. Images are pushed with the built-in `GITHUB_TOKEN`.

## Repository variable (optional)

`NEXT_PUBLIC_API_URL` (Settings > Secrets and variables > Actions > Variables) is baked into the frontend image at build time. Default: `http://localhost:8080`.

## Images

```bash
docker pull ghcr.io/<owner>/ecommerce-backend:latest
docker pull ghcr.io/<owner>/ecommerce-frontend:latest
docker pull ghcr.io/<owner>/ecommerce-nginx:latest
```
