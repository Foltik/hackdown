# HackDown

## Setup

### Database

Create the Kubernetes clusters and add them to the zones in `db/setup.py`

Then run the script to create the multi-cluster cockroachdb deployment:

```console
python2 db/setup.py
```

### Backend

Create the deployments for the backend:

```console
kubectl apply -f app/deployment.yaml
```
