# Domain, SSL, and Ports Setup Guide

This guide is for NeuroNanoBanana-style deployments where a backend service (for example, FastAPI + uvicorn) is exposed through a reverse proxy.

Repository note: this repo is a Vite/React frontend and does not itself open backend ports such as `8080`. Use this guide when deploying a companion backend service on your host or in Docker.

Current deployment fact:

- DNS update confirmed: `intelinum.duckdns.org` -> `144.217.12.20`

## 1) What the application listens on

| Role | Default | Config |
| --- | --- | --- |
| Web app (FastAPI/uvicorn: admin, web UI, webhooks, API) | `8080` | `ADMIN_PORT` in `.env` |
| Docker publish (if using compose) | host `8080` -> container `8080` | Change host side if busy, for example `9090:8080` |

Usually not opened by the Python app itself:

- `80` / `443`: handled by reverse proxy (Nginx, Traefik, Caddy).
- `465` (SMTP): outbound only, no inbound exposure required.

Traefik note:

- Traefik normally owns `80` and `443`, terminates TLS, and routes by host.
- Avoid binding another service to the same host ports unless you intentionally merge configurations.

## 2) Audit ports before binding

Run on the server:

```bash
# List listeners on common web ports and app port
sudo ss -tlnp | grep -E ':80|:443|:8080'

# Alternative (if lsof is installed)
sudo lsof -i :80 -i :443 -i :8080

# Full TCP listening overview
sudo ss -tlnp
```

Rules of thumb:

- Only one listener per host+port.
- If `80/443` are already used by Nginx or Traefik, reuse that proxy for the new domain.
- If `8080` is busy, choose a free port such as `8081`, `8888`, or `9090`, then update both:
  - app listen port (`ADMIN_PORT`)
  - Docker mapping (`NEWPORT:INTERNAL_PORT`) and internal service port if needed

## 3) Connect domain (DNS)

At your DNS provider:

- `A` record: `yourdomain.com` -> server public IPv4
- `AAAA` record (optional): -> IPv6
- subdomain example: `app.yourdomain.com` -> same server IP

Check propagation:

```bash
dig +short yourdomain.com A
```

Firewall (if TLS terminates on this machine):

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

If exposing backend port directly (not recommended for production):

```bash
sudo ufw allow 8080/tcp
```

## 4) SSL: choose one path

### A) Nginx reverse proxy + Let's Encrypt (Certbot)

1. Point DNS to this server.
2. Ensure port `80` is reachable for ACME HTTP challenge.
3. Configure Nginx `443 ssl` and proxy to `http://127.0.0.1:ADMIN_PORT`.
4. Forward these headers:
   - `Host`
   - `X-Real-IP`
   - `X-Forwarded-For`
   - `X-Forwarded-Proto $scheme`

Renewal:

```bash
certbot renew
```

### B) Traefik (Docker)

- Traefik listens on `80/443`, gets certificates, and routes using labels.
- Set host rule to your domain, TLS resolver, and service port to backend internal port (for example `8080`).
- Ensure backend service is attached to the same Docker network as Traefik.

### C) Caddy

- Use automatic HTTPS.
- Configure `reverse_proxy` to backend app (for example `127.0.0.1:8080`).

## 5) Application config after domain is live

Set environment variables:

| Variable | Purpose |
| --- | --- |
| `ADMIN_URL` | Public base URL users access, for example `https://yourdomain.com` |
| `PUBLIC_BASE_URL` | Public URL fallback for redirects/webhooks if your app uses this variable |
| `ADMIN_PORT` | Port uvicorn listens on (host/container, depending on deployment) |

OAuth provider callback URLs should use the real HTTPS domain, for example:

- `https://yourdomain.com/auth/google/callback`
- `https://yourdomain.com/auth/vk/callback`

Webhook endpoints should also be HTTPS on the final domain.

## 6) Go-live checklist

- DNS `A` record resolves to this server.
- `80/443` reachable from the internet.
- Browser shows a valid certificate.
- `ADMIN_URL` / `PUBLIC_BASE_URL` match exact `https://` host.
- Proxy target port matches app listen port.
- No duplicate host-port listeners.
- Smoke test endpoints:
  - `/`
  - `/web-login`
  - OAuth callback flow (if enabled)

## 7) Related references

- Add your Nginx/Certbot snippets under `docs/DOMAIN_SSL_FAVICON_GUIDE.md` if you maintain that companion guide.
- Keep deployment examples aligned with your Compose file if using Docker/Traefik.
