# ShopBiz

ShopBiz is a full-stack ecommerce app built with Next.js App Router, MongoDB (via Prisma), NextAuth (JWT sessions), Stripe-ready checkout, and Tailwind CSS.

## Features

- Next.js full-stack architecture (server components + API routes)
- MongoDB data layer using Prisma ORM
- NextAuth credentials login with JWT token sessions and role-based access (`ADMIN`, `USER`)
- Product catalog with categories and search/filtering
- Cart + checkout flow with Stripe Elements + webhook-based payment verification
- Orders management for users and admin
- Admin dashboard for stats, product management, and order status updates
- Responsive UI with animation and 3D hero section
- SEO basics: metadata, Open Graph, robots, sitemap

## Environment

Create `.env` from `.env.example` and set:

- `DATABASE_URL` (MongoDB connection string)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Getting Started

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

### Seeded Accounts

- Admin: `admin@shopbiz.com` / `Admin@123`
- User: `user@shopbiz.com` / `User@123`

## API Overview

- `POST /api/register`
- `GET,POST /api/categories`
- `GET,POST /api/products`
- `GET,PUT,DELETE /api/products/:id`
- `GET,POST /api/orders`
- `GET,PATCH /api/orders/:id`
- `POST /api/payments/checkout`
- `POST /api/payments/webhook`
- `GET /api/admin/stats`

## Notes

- Stripe orders are created in `PENDING` state and only marked `PAID` by verified Stripe webhook events.
- `/admin/*` routes are protected for admin role only.


