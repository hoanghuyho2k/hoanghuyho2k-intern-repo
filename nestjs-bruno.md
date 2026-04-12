
# API Debugging with Bruno

## What is Bruno?

Bruno is an open-source, offline-first, Git-friendly API client for testing APIs. Its documentation describes it as a local-first tool that stores collections in plain text, which makes it easier to version-control API requests and collaborate through Git.

## How Bruno differs from Postman or cURL

Compared with Postman, Bruno is more Git-friendly and local-first because collections are stored as files in your project instead of being centered around a cloud workspace. Compared with cURL, Bruno provides a graphical interface, request organization, and reusable collections, while still letting you configure headers, auth, and environments more easily. Bruno’s docs emphasize its offline-first and Git-friendly workflow.

## Creating a Bruno collection

Bruno supports creating a new collection directly in the app. The starter guide and getting-started docs explain that Bruno organizes requests into collections and folders for easier API testing and maintenance.

## Sending headers and authentication

Bruno lets you add request headers manually from the Headers tab. Its docs explain that you create a request, go to Headers, enter the header name and value, then save and execute the request. Bruno also supports auth configuration at collection, folder, and request levels, including OAuth 2.0.

## Create a simple collection

```bash
FocusBear-NestJS
```

Add a simple public NestJS endpoint:

```bash
Method: GET
URL: http://localhost:3000/tasks
```

```bash
Method: POST
URL: http://localhost:3000/tasks
Body (JSON): {
  "title": "Test task from Bruno"
}
```

Add headers or token

```bash
Authorization → Bearer test-token
Content-Type → application/json
```

NestJS response:

```bash
[21:32:30.857] INFO (8752): request completed
    req: {
      "id": "req-3",
      "method": "POST",
      "url": "/tasks",
      "query": {},
      "headers": {
        "user-agent": "bruno-runtime/3.2.2",
        "authorization": "Bearer test-token",
        "content-type": "application/json",
        "request-start-time": "1775993550801",
        "content-length": "37",
        "accept-encoding": "gzip, compress, deflate, br",
        "host": "localhost:3000",
        "connection": "keep-alive"
      },
      "remoteAddress": "127.0.0.1",
      "remotePort": 59001
    }
    res: {
      "statusCode": 201,
      "headers": {
        "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "origin-agent-cluster": "?1",
        "referrer-policy": "no-referrer",
        "strict-transport-security": "max-age=31536000; includeSubDomains",
        "x-content-type-options": "nosniff",
        "x-dns-prefetch-control": "off",
        "x-download-options": "noopen",
        "x-frame-options": "SAMEORIGIN",
        "x-permitted-cross-domain-policies": "none",
        "x-xss-protection": "0",
        "x-ratelimit-limit": 5,
        "x-ratelimit-remaining": 4,
        "x-ratelimit-reset": 60,
        "content-type": "application/json; charset=utf-8",
        "content-length": "39"
      }
    }
    responseTime: 52
[21:32:56.630] INFO (8752): request completed
    req: {
      "id": "req-4",
      "method": "GET",
      "url": "/tasks",
      "query": {},
      "headers": {
        "user-agent": "bruno-runtime/3.2.2",
        "authorization": "Bearer test-token",
        "content-type": "application/json",
        "request-start-time": "1775993576596",
        "content-length": "37",
        "accept-encoding": "gzip, compress, deflate, br",
        "host": "localhost:3000",
        "connection": "keep-alive"
      },
      "remoteAddress": "127.0.0.1",
      "remotePort": 59004
    }
    res: {
      "statusCode": 200,
      "headers": {
        "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "origin-agent-cluster": "?1",
        "referrer-policy": "no-referrer",
        "strict-transport-security": "max-age=31536000; includeSubDomains",
        "x-content-type-options": "nosniff",
        "x-dns-prefetch-control": "off",
        "x-download-options": "noopen",
        "x-frame-options": "SAMEORIGIN",
        "x-permitted-cross-domain-policies": "none",
        "x-xss-protection": "0",
        "x-ratelimit-limit": 5,
        "x-ratelimit-remaining": 3,
        "x-ratelimit-reset": 35,
        "content-type": "application/json; charset=utf-8",
        "content-length": "189"
      }
    }
    responseTime: 29
```

## Reflection

### How does Bruno help with API testing compared to Postman or cURL?

Bruno helps by providing a lightweight graphical API client that is open source, offline-first, and Git-friendly. Compared with cURL, it is easier to organize and reuse requests. Compared with Postman, its collections are stored locally as plain files, which fits well with version control and project-based workflows.

### How do you send an authenticated request in Bruno?

You can send an authenticated request by adding the required `Authorization` header in the Headers tab, or by using Bruno’s built-in authentication settings such as OAuth 2.0 at the collection, folder, or request level.

### What are the advantages of organizing API requests in collections?

Collections make it easier to group related endpoints, reuse headers or auth settings, and keep API requests structured for testing and debugging. They also make collaboration easier because Bruno stores these collections as files that can be committed to Git.

### How would you structure a Bruno collection for a NestJS backend project?

I would organize the collection by feature or module, for example:
- Auth
- Tasks
- Admin
- Secret Notes

Inside each folder, I would keep related GET, POST, PUT, and DELETE requests. I would also use environments or collection-level variables for base URLs, tokens, and other reusable values, since Bruno supports environment variables and scoped auth configuration.
