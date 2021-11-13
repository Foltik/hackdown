# HackDown

## Setup

### Backend

### Database

Add the CockroachDB chart and install it on the cluster.

```
helm repo add cockroachdb https://charts.cockroachdb.com/
helm repo update
helm install db cockroachdb/cockroachdb --values db.yaml
```
