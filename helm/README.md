# Helm chart: ecommerce

Chart path: `helm/ecommerce`. Images (must be available in the cluster): `ecommerce-backend:1.0.0`, `ecommerce-frontend:1.0.0`, `ecommerce-nginx:1.0.0`, `mongo:7`.

## Install

```bash
helm install ecommerce helm/ecommerce -n ecommerce --create-namespace \
  --set secrets.jwtSecret="$(grep '^JWT_SECRET=' .env | cut -d= -f2-)" \
  --set backend.jwtExpiresIn="$(grep '^JWT_EXPIRES_IN=' .env | cut -d= -f2-)" \
  --wait --timeout 5m
```

## Upgrade / rollback

```bash
helm upgrade ecommerce helm/ecommerce -n ecommerce --reuse-values --set backend.replicas=3 --wait
helm history ecommerce -n ecommerce
helm rollback ecommerce 1 -n ecommerce --wait
```

## Access

```bash
kubectl -n ecommerce port-forward svc/nginx 8080:80   # http://localhost:8080
```

`secrets.jwtSecret` is required and must never be committed.
