# Kubernetes manifests (minikube)

Namespace: `ecommerce`. Images: `ecommerce-backend:1.0.0`, `ecommerce-frontend:1.0.0`, `ecommerce-nginx:1.0.0`, `mongo:7`.

## Deploy order

```bash
kubectl apply -f kubernetes/00-namespace.yaml
kubectl apply -f kubernetes/01-mongo.yaml
kubectl -n ecommerce rollout status statefulset/mongo
kubectl apply -f kubernetes/02-mongo-init-job.yaml
kubectl -n ecommerce wait --for=condition=complete job/mongo-init
# secret is NOT stored in git; create it from the root .env
kubectl -n ecommerce create secret generic backend-secret \
  --from-literal=JWT_SECRET="$(grep '^JWT_SECRET=' .env | cut -d= -f2-)" \
  --from-literal=JWT_EXPIRES_IN="$(grep '^JWT_EXPIRES_IN=' .env | cut -d= -f2-)"
kubectl apply -f kubernetes/03-backend.yaml
kubectl apply -f kubernetes/04-frontend.yaml
kubectl apply -f kubernetes/05-nginx.yaml
```

## Access

```bash
kubectl -n ecommerce port-forward svc/nginx 8080:80   # http://localhost:8080
```
