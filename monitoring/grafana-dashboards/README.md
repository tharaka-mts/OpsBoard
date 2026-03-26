# Grafana Dashboards Directory

The standard Kubernetes cluster and node dashboards are automatically provisioned by the `kube-prometheus-stack` chart and are included by default.

## Adding Custom Dashboards
If custom application dashboards (e.g., Spring Boot JVM metrics, API metrics) are required in future phases:
1. Export the dashboard from the Grafana UI as a JSON file.
2. Place the JSON file in this `grafana-dashboards/` folder.
3. Configure Grafana's `dashboardProviders` in `prometheus-values.yaml` to sidecar-load or natively import these JSON files.

For the initial monitoring version, no custom dashboards are needed, as the default Prometheus cluster summary provides excellent visibility for screenshots/demos.
