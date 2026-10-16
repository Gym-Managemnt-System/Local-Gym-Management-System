# User Stories - Asynchronous Distributed Log & Audit Analytics Pipeline

## 1. Log Ingestion Module (Uploader / Operator)
- **US01 (FR-1.1):** As a System Operator, I want to upload a log archive (`.json` or `.json.gz`) along with service metadata (`service_name` and `environment`) via the REST API so that microservice log batches can be analyzed.
- **US02 (FR-1.2):** As a System Operator, I want the system to validate the file size and schema upon upload so that invalid or oversized files are rejected immediately with clear error responses.
- **US03 (FR-1.3 & FR-1.4):** As an Ingestion Service, I want to store raw uploaded files in Object Storage and create an initial metadata record with `pending` status so that the upload operation is logged and tracked.
- **US04 (FR-1.5):** As a System Operator, I want to receive an immediate response with a unique `ingest_id` without waiting for processing to complete, ensuring non-blocking and low-latency API interactions.

## 2. Asynchronous Processing & Worker Module (Background System / Worker)
- **US05 (FR-2.1):** As an Ingestion API, I want to publish an ingestion event payload (`ingest_id`, `service_name`, `object_key`) to a message queue so that processing is decoupled from the ingestion layer.
- **US06 (FR-2.2 & FR-2.3):** As a Background Worker, I want to consume queue messages, download log archives, parse JSON Lines, and classify log entries by severity (`CRITICAL`, `ERROR`, `WARN`, `INFO`).
- **US07 (FR-2.4):** As a Background Worker, I want to aggregate log statistics to calculate total log counts, per-severity breakdowns, and identify top recurring error messages for each service.
- **US08 (FR-2.5 & FR-2.6):** As a Background Worker, I want to update metadata records with computed metrics and set the status to `completed` on success or `failed` on error, ensuring processing errors do not halt the entire pipeline.
- **US09 (FR-2.7 & FR-2.8):** As a System Architect, I want worker status updates to be idempotent and failing messages to route to a Dead-Letter Queue (DLQ) after retries, ensuring data integrity and fault tolerance.

## 3. Metrics & Status Retrieval Module (Viewer / Analyst)
- **US10 (FR-3.1):** As an Analyst, I want to query the status and computed metrics for a specific `ingest_id` so that I can inspect the results of a particular log batch.
- **US11 (FR-3.2):** As an Analyst, I want to retrieve an aggregated summary of system health and error statistics grouped by service so that overall system availability can be monitored.
- **US12 (FR-3.3):** As an Analyst, I want status endpoints to serve the latest database records accurately regardless of Worker or Queue state.

## 4. Analytics Dashboard Module (Viewer / Analyst)
- **US13 (FR-4.1):** As an Analyst, I want an interactive dashboard UI to easily upload log batches with service metadata without manually sending API requests.
- **US14 (FR-4.2):** As an Analyst, I want to view a live status table of all log ingestions so that I can monitor their processing states in real time.
- **US15 (FR-4.3 & FR-4.4):** As an Analyst, I want to view severity breakdown charts and top error messages per service on the dashboard for rapid root-cause diagnosis.
