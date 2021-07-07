# cloud-run-routing-issue-reproduction

There seems to be an issue with the routing of a Cloud Run service when a server
startup is slow. When a new revision is deployed, the service is not immediately
ready to serve traffic. An expectation is that until the server is ready, the
previous revision should serve all traffic. This does not seem to work.

This reproduction shows that the routing of a Cloud Run service is switched to
a new revision before it is not ready. The code in the `index.js` starts the
server after 30 seconds to simulate a slow startup. It can be verified that
within 30 seconds from process start, no TCP connections are accepted:

1. Start the server with `node index.js`.
2. Verify that the server does not accept any TCP connections, e.g. with
   `telnet 0.0.0.0 8080` (in a separate terminal).
3. After 30 seconds, the server should be ready to accept connections. 
   A "Starting the server." message should be printed to the console.

To reproduce the issue, deploy to a Cloud Run service:

```bash
gcloud alpha run deploy routing-issue \
  --min-instances=1 \
  --project=CHANGE_ME \
  --region=us-central1 \
  --source=.
```

After the first deployment is complete, verify it's working by accesing the
service URL. It should respond with a 200 OK.

Next, run the same command again to deploy a new revision. When the "routing
traffic" step begins, make a request to the service URL. The request will hang
until the server starts (up to 30 seconds).

What would be an expected result?

As part of a deployment process, instances of the new revision are created
(`--min-instances`). When these instances are ready to serve traffic (start 
accepting TCP connections), the service traffic should be routed to the new
revision.
