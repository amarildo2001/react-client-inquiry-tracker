# REST API reference

All endpoints return JSON. Responses use `Cache-Control: no-store`. The API is same-origin and uses the `inquiry_demo_session` HttpOnly cookie to select the current demo workspace. Persist the cookie between requests. The health endpoint does not create a workspace.

## GET /api/health

Returns HTTP 200 when the database responds:

```json
{"status":"ok","database":"connected","application":"Client Inquiry Tracker"}
```

## GET /api/inquiries

Returns HTTP 200 with an `inquiries` array. On first use, a new workspace is created with four fictional sample inquiries. A random 256-bit cookie identifies the workspace; only its SHA-256 digest is stored in the database. Every inquiry query is scoped to that workspace.

```json
{"inquiries":[{"id":"generated-uuid","name":"Alex Morgan","email":"alex@example.com","service":"WordPress","budget":1500,"message":"Refresh the business website.","status":"New","createdAt":"ISO-8601 timestamp"}]}
```

## POST /api/inquiries

Send `Content-Type: application/json`:

```json
{"name":"Alex Morgan","email":"alex@example.com","service":"WordPress","budget":1500,"message":"Refresh the business website."}
```

Returns HTTP 201 with `{"inquiry": {...}}`. Status is initially New. Name must be 2–80 characters, email must be valid and no longer than 160 characters, budget must be an integer between 0 and 1,000,000, and notes may be up to 1,000 characters. `message` may be omitted. Unknown fields are rejected.

Allowed services: Website development, WordPress, SEO & marketing, Other.

A workspace supports up to 100 inquiries for normal sequential use. This is a demo bound, not a concurrency-safe quota or rate limiter.

## PATCH /api/inquiries/:id

```json
{"status":"Won"}
```

Allowed statuses: New, Contacted, Won. Returns HTTP 200 with `{"inquiry": {...}}` or HTTP 404 if the record is missing or belongs to another workspace.

## DELETE /api/inquiries/:id

Returns HTTP 200 with `{"deleted":true,"id":"..."}`. Repeating a successful deletion returns HTTP 404.

## Errors

| Status | Meaning |
| --- | --- |
| 400 | Invalid JSON, invalid input, wrong content type, or oversized JSON body |
| 403 | Cross-origin or cross-site write rejected |
| 404 | Record not found in this workspace |
| 409 | Demo workspace inquiry limit reached |
| 503 | Database or service unavailable |

Errors include an `error` string. Validation failures on creation may include field details. SQL queries use bound parameters. Database failures are logged server-side without returning internal errors to visitors.

## Example with curl

After starting the app, replace the local origin below with the port printed by the server:

```bash
curl -c cookies.txt http://localhost:5173/api/inquiries
curl -b cookies.txt -c cookies.txt -H 'Content-Type: application/json' -d '{"name":"Alex Morgan","email":"alex@example.com","service":"WordPress","budget":1500,"message":"Refresh the business website."}' http://localhost:5173/api/inquiries
```

Do not commit the cookie file. The live hosted demo may have an access gate separate from these application endpoints.
