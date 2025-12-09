# Phase 8 — Monitor

This project includes example Kubernetes manifests and a GitHub Actions listener to demonstrate a monitoring → pipeline feedback loop.

- **HPA (Horizontal Pod Autoscaler):** `k8s/hpa.yaml` — scales the `notes-app` deployment between 2 and 10 replicas based on CPU (target 50% average utilization).

- **Prometheus Rule:** `k8s/monitoring/prometheus-rule.yaml` — example rule `HighCPUUtilization` that fires when sustained CPU usage is high for the `notes-app` pods.

- **Alertmanager receiver:** `k8s/monitoring/alertmanager-configmap.yaml` — example ConfigMap showing how Alertmanager could POST to the GitHub Repository Dispatch API. In production use a secure relay or templating to produce the correct GitHub `dispatches` payload and protect tokens.

- **Pipeline trigger workflow:** `.github/workflows/monitor-triggered-deploy.yml` — listens for `repository_dispatch` events of type `monitoring_alert` and triggers the repository's `deploy.yml` workflow via the GitHub REST API.

## How it fits together (end-to-end):

1. Prometheus scrapes pod metrics and evaluates the `PrometheusRule`.
2. When the `HighCPUUtilization` alert fires, Alertmanager sends the alert to a receiver.
3. The receiver (example is a webhook) posts a GitHub Repository Dispatch event with `event_type` `monitoring_alert` and optional `client_payload`.
4. `.github/workflows/monitor-triggered-deploy.yml` runs on the `repository_dispatch` event and triggers `deploy.yml` (or other remediation workflows) to perform a rollout, scale change, or any automated response.

## Testing locally / end-to-end checklist

1. Apply manifests to your cluster (adjust namespace as needed):

```bash
# Apply the HPA and monitoring examples
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/monitoring/prometheus-rule.yaml
# Configure Alertmanager with a safe token or use a relay service
kubectl apply -f k8s/monitoring/alertmanager-configmap.yaml
```

2. Configure Alertmanager (or a relay) to POST a repository dispatch:

Example curl to simulate the alert (replace OWNER/REPO and TOKEN):

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<OWNER>/<REPO>/dispatches \
  -d '{"event_type":"monitoring_alert","client_payload":{"alert":"HighCPU","summary":"Simulated alert"}}'
```

3. Verify workflow run

- Go to the GitHub Actions tab and look for **Monitor-triggered Deploy** runs.
- Confirm that the workflow triggered the `deploy.yml` workflow (or handled the alert as configured).

## Security notes

- Never commit real tokens to manifests. Use a secure secret store (sealed secrets, HashiCorp Vault, Kubernetes Secrets with proper RBAC, or a relay service).
- Prefer a small relay service that verifies and formats Alertmanager payloads before calling the GitHub API.

## Next steps I can do for you

- Add a tiny example relay script (Node.js) to transform Alertmanager alerts to GitHub repository dispatch payloads.
- Patch the `deploy.yml` workflow to accept an input from the monitor-run and perform a specific automated remediation (for example, `kubectl rollout restart` or scale change).
