# RANGAMAI.in — Full-Stack Website, Admin Dashboard & Backend

You are working on a production-ready web application for **RANGAMAI.in**.

RANGAMAI is a software and AI solutions company. We build and deliver custom solutions for clients, including:

* AI Systems
* AI Agents
* AI-powered automation
* Web Applications
* Mobile Applications
* Custom Software
* Business/Workflow Automation
* Other custom technology solutions

The goal is to build a **professional, SEO-first company website with a dynamic CMS-style admin dashboard and backend API**.

The public website should not be a static hardcoded website. Most business content such as services, projects/showcase, banners, descriptions, ordering, contact information and SEO metadata must be manageable from the admin dashboard without modifying code.

---

# 1. Core Architecture

Build the system as three logical applications:

```text
RANGAMAI.in
│
├── Public Website
│   └── Next.js + TypeScript
│
├── Admin Dashboard
│   └── Next.js + TypeScript
│
└── Backend API
    └── NestJS + TypeScript
```

Database:

```text
MongoDB Atlas
```

Media storage:

```text
Cloudinary
```

Deployment:

```text
Docker
Docker Compose
Nginx
AWS EC2
GitHub Actions
Let's Encrypt / HTTPS
Cloudflare DNS
```

Do NOT introduce Redis initially.

Do NOT introduce microservices.

Do NOT over-engineer the system.

The architecture should be modular and production-ready while remaining simple enough to maintain.

---

# 2. Technology Stack

Use the following stack unless there is a strong technical reason to change something:

## Public Website

* Next.js
* TypeScript
* Tailwind CSS
* Server-side rendering / static generation where appropriate
* Dynamic SEO metadata
* Dynamic routes for services and projects

## Admin Dashboard

* Next.js
* TypeScript
* Tailwind CSS
* Clean professional dashboard UI
* Authentication-protected routes

## Backend

* NestJS
* TypeScript
* MongoDB
* Mongoose
* REST API
* Zod or appropriate validation strategy where useful
* Proper DTO validation
* Modular architecture

## Authentication

Admin authentication using:

* JWT
* Secure HttpOnly cookies
* Password hashing
* Protected admin routes
* Proper authentication/authorization guards

Never store plaintext passwords.

## Media

Use Cloudinary for:

* Service banners
* Service images/icons
* Project cover images
* Project screenshots
* Client logos
* Other website media

Do not store uploaded production media permanently on the EC2 filesystem.

Store media metadata and URLs in MongoDB.

## Email

Use Resend or another clean transactional email provider for contact/lead notifications.

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Let's Encrypt
* AWS EC2
* Cloudflare
* GitHub Actions

---

# 3. Public Website

The public website is the main customer-facing part of RANGAMAI.in.

It must be modern, premium, responsive and professional.

The website should clearly communicate:

> RANGAMAI builds AI-powered software, intelligent agents, web applications, mobile applications and custom digital solutions for businesses.

Do not use generic agency copy such as meaningless marketing statements.

The user should understand within a few seconds:

1. What RANGAMAI does
2. What services are provided
3. What kind of projects RANGAMAI builds
4. How to contact RANGAMAI

---

# 4. Homepage / Landing Page

Create a proper landing page containing sections such as:

## Hero Section

Dynamic content:

* Main heading
* Subheading/description
* Primary CTA
* Secondary CTA
* Hero/banner image if required

Example CTA concepts:

* Start a Project
* Get in Touch
* Tell Us Your Idea

Hero content should be manageable from the admin dashboard.

## Services Preview

Display selected services.

The admin should be able to control:

* Which services are featured
* Display order

## Showcase / Featured Projects

Display selected projects.

Admin should be able to control:

* Featured/unfeatured
* Display order

## Why RANGAMAI

Explain the company's approach/value.

## How We Work

For example:

```text
1. Understand
2. Plan
3. Build
4. Test
5. Deploy
6. Support
```

This section can initially be managed through website settings/content configuration.

## Final CTA

Strong contact/project CTA.

## Footer

Include:

* Navigation
* Services
* Contact details
* WhatsApp
* Email
* Phone
* Instagram
* LinkedIn
* Copyright
* Legal links if required

---

# 5. Services System

Services must be dynamic.

Admin must be able to:

* Create service
* Edit service
* Delete service
* Publish/unpublish service
* Change service banner
* Upload service images
* Change service description
* Change display order
* Mark service as featured
* Configure SEO metadata

Each service should support:

```text
title
slug
shortDescription
description
banner
images
icon
displayOrder
featured
published
createdAt
updatedAt
```

SEO fields:

```text
metaTitle
metaDescription
canonicalUrl
ogImage
```

Example public routes:

```text
/services/ai-agents
/services/ai-systems
/services/web-applications
/services/mobile-applications
```

Each service should have its own SEO-friendly page.

---

# 6. Service Ordering

The admin must control which service appears first.

Example:

```text
1. AI Agents
2. AI Systems
3. Web Applications
4. Mobile Applications
5. Custom Software
```

If the admin changes the order, the public website should automatically reflect the new order.

Prefer drag-and-drop ordering in the admin dashboard if practical.

---

# 7. Showcase / Projects System

RANGAMAI needs a complete project showcase/case-study system.

Admin must be able to:

* Add project
* Edit project
* Delete project
* Publish/unpublish
* Feature/unfeature
* Change project order
* Upload cover image
* Upload screenshots/gallery
* Add project description
* Add technologies
* Associate project with a service
* Associate project with a client
* Add live project URL
* Add GitHub URL if applicable
* Configure SEO metadata

Each project should have its own public page.

Example:

```text
/showcase/mecfinders
/showcase/onchikitsa
/showcase/project-name
```

---

# 8. Project / Case Study Structure

Each project should support detailed information such as:

```text
Project Title

Short Description

Cover Image

Detailed Description

Problem

Solution

Key Features

Technology Stack

Client

Industry

Services Used

Screenshots / Gallery

Live URL

GitHub URL

Display Order

Featured

Published
```

SEO:

```text
Meta Title
Meta Description
Canonical URL
OG Image
```

The project page should look like a professional case study, not simply a card with a few lines of text.

---

# 9. Clients

Create a client management module in the admin dashboard.

Admin should be able to:

* Add client
* Edit client
* Delete client
* Upload client logo
* Add company name
* Add website
* Add industry
* Associate projects

Example structure:

```text
Client
├── Company Name
├── Logo
├── Website
├── Industry
├── Description
├── Projects
└── Status
```

Optionally display selected client logos on the public website under:

```text
Trusted By / Our Clients
```

Do not show confidential client information publicly unless explicitly configured.

---

# 10. Contact Us

Create a proper Contact Us page.

The public form should support fields such as:

```text
Name
Email
Phone
Company
Service Required
Message
```

Optional:

```text
Budget Range
Project Type
```

Do not make the form unnecessarily complicated.

On submission:

```text
Public Website
      ↓
Backend API
      ↓
Lead stored in MongoDB
      ↓
Notification email
```

Show a proper success/error state to the user.

Add spam/rate-limiting protection where appropriate without introducing Redis initially.

---

# 11. Contact Information

Contact details should be manageable from the admin dashboard.

Support:

```text
Phone
Email
WhatsApp
Instagram
LinkedIn
Other social links
Business address if required
```

These details should be displayed throughout the public website where appropriate.

For WhatsApp, provide a proper clickable WhatsApp CTA.

For phone:

```text
tel:
```

For email:

```text
mailto:
```

Social links should be configurable rather than hardcoded.

---

# 12. Leads Management

Every contact form submission should become a lead.

Lead model should contain:

```text
name
email
phone
company
service
message
source
status
notes
createdAt
updatedAt
```

Lead statuses:

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
CLOSED
LOST
```

Admin must be able to:

* View leads
* Search leads
* Filter leads
* Update status
* Add internal notes
* View lead details
* Delete/archive leads if required

The admin dashboard should show recent leads.

---

# 13. Admin Dashboard

Create a dedicated protected admin dashboard.

Suggested structure:

```text
Admin
│
├── Dashboard
├── Leads
├── Clients
├── Projects / Showcase
├── Services
├── Media
├── Contact Details
├── Homepage
├── SEO Settings
└── Website Settings
```

Dashboard overview should show useful metrics such as:

```text
Total Leads
New Leads
Total Clients
Total Projects
Total Services
```

And recent leads/projects.

Do not build fake analytics that are not backed by actual data.

---

# 14. Homepage CMS

Admin should be able to manage important homepage content.

At minimum:

```text
Hero Heading
Hero Description
Hero CTA
Hero Image/Banner

Featured Services
Featured Projects

Why RANGAMAI content
Process content
Final CTA
```

The admin should be able to decide which services/projects appear in featured sections.

---

# 15. Media Management

Create a simple media management approach.

Images should be uploaded to Cloudinary.

Support:

* Upload
* Replace
* Delete
* Preview
* Alt text
* Public URL

Avoid storing large images directly inside MongoDB.

Avoid storing permanent production uploads on EC2.

---

# 16. SEO Requirements

SEO is one of the primary requirements of this project.

Do not treat SEO as an afterthought.

Implement:

* Dynamic page titles
* Dynamic meta descriptions
* Canonical URLs
* Open Graph metadata
* Social metadata
* SEO-friendly slugs
* XML sitemap
* robots.txt
* Proper heading hierarchy
* Semantic HTML
* Image alt text
* Structured data / JSON-LD where appropriate
* Service-specific metadata
* Project-specific metadata
* Fast page loading
* Mobile responsiveness
* Proper internal linking

Dynamic pages must generate correct metadata.

Examples:

```text
/services/ai-agents
/services/web-applications
/showcase/mecfinders
/showcase/onchikitsa
```

Do not build the public website as a client-only SPA because SEO is a major objective.

Use Next.js SSR/SSG/ISR appropriately.

---

# 17. Database Design

Create clean MongoDB schemas/models for at least:

```text
Admin/User
Service
Project
Client
Lead
Media
SiteSettings
SEO/WebsiteSettings
```

Use appropriate indexes.

At minimum consider indexes for:

```text
slug
email
status
createdAt
displayOrder
published
featured
```

Avoid duplicate indexes.

Keep relationships and references clean.

---

# 18. API Architecture

Build the backend as modular NestJS modules.

Suggested structure:

```text
src/
├── auth/
├── users/
├── services/
├── projects/
├── clients/
├── leads/
├── media/
├── settings/
├── seo/
└── common/
```

Use:

* DTOs
* Validation
* Guards
* Authentication
* Authorization
* Proper error handling
* Logging
* HTTP status codes
* Consistent API response structure

Do not put everything into one giant controller/service.

---

# 19. Security

Implement reasonable production security:

* HttpOnly cookies
* Secure cookies in production
* Password hashing
* JWT expiration
* Authentication guards
* Authorization checks
* CORS configuration
* Request validation
* Rate limiting where appropriate
* File upload validation
* File size limits
* Secure HTTP headers
* No secrets in Git
* No API keys hardcoded in frontend
* Environment variables for secrets

Never commit:

```text
.env
API keys
database passwords
JWT secrets
Cloudinary secrets
AWS secrets
```

Use environment variables.

---

# 20. Docker

The application must be fully Dockerized.

Create production-ready:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

Containers should include appropriate:

```text
Frontend
Backend
Nginx
```

Do not containerize MongoDB because production MongoDB will be MongoDB Atlas.

Use Docker health checks where practical.

Use restart policies.

The application should be reproducible on a fresh Ubuntu EC2 instance.

---

# 21. Nginx

Nginx should act as the reverse proxy.

Example conceptual routing:

```text
rangamai.in
      ↓
   Nginx
      ↓
Next.js frontend

api.rangamai.in
      ↓
   Nginx
      ↓
NestJS backend
```

Do not expose backend internal ports publicly if unnecessary.

Only expose required public ports.

---

# 22. HTTPS / SSL

Use Let's Encrypt.

SSL must be automated as much as reasonably possible.

Requirements:

* HTTPS
* HTTP → HTTPS redirect
* Automatic certificate renewal
* Nginx HTTPS configuration

Do not bake certificates into Docker images.

Certificates should be managed through the deployment/infrastructure layer.

---

# 23. AWS EC2

Target environment:

```text
Ubuntu
AWS EC2
```

The deployment must not depend on a specific EC2 instance.

The goal is:

> A fresh Ubuntu EC2 should be able to run the entire application through a documented bootstrap/deployment process.

---

# 24. One-Command Server Setup

Create a deployment/bootstrap script.

Example:

```bash
./bootstrap.sh
```

or:

```bash
./deploy.sh
```

The exact naming is your decision.

The script should automate as much as safely possible:

```text
Check/install Docker
Check Git
Prepare environment
Pull application
Build/pull images
Start containers
Configure Nginx
Configure HTTPS
Run health checks
```

Do not make destructive assumptions.

If a step requires a value that cannot safely be automated, clearly document it.

---

# 25. CI/CD

The final system must support automatic deployment.

Desired workflow:

```text
Developer
   ↓
git add .
git commit
git push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Build/Test
   ↓
Docker image build
   ↓
Deploy to EC2
   ↓
Health Check
   ↓
Application Updated
```

The goal is that after initial server provisioning, normal application changes should require only:

```bash
git push
```

The server should automatically deploy the new version.

Do not require manually logging into EC2 for every normal code update.

Use GitHub Secrets for deployment credentials.

Prefer a secure deployment mechanism.

---

# 26. Deployment Safety

Do not blindly replace a working production deployment.

The deployment process should:

1. Build the new version
2. Validate it
3. Deploy
4. Perform health checks
5. Fail clearly if the deployment fails

Where practical, design for easy rollback.

Do not delete the currently working application before confirming the new version is healthy.

---

# 27. Environment Configuration

Create clear environment configuration.

Example categories:

```text
DATABASE_URL
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
NEXT_PUBLIC_API_URL
APP_URL
```

Never hardcode production secrets.

Provide:

```text
.env.example
```

with placeholders only.

---

# 28. Code Quality

Follow:

* TypeScript strict mode where practical
* Clean architecture
* SOLID principles where useful
* Reusable components
* Reusable API services
* Consistent naming
* Proper error handling
* No unnecessary duplication
* No dead code
* No fake/mock production logic unless explicitly required

Do not over-engineer.

Do not add Redis, Kafka, Kubernetes, microservices or other infrastructure unless a real requirement emerges.

---

# 29. UI/UX

The public website should feel like a serious modern AI/software company.

Requirements:

* Premium
* Minimal
* Fast
* Responsive
* Accessible
* Good typography
* Strong visual hierarchy
* Professional animations used sparingly
* Mobile-first responsiveness

Avoid:

* Excessive gradients
* Excessive animations
* Generic template appearance
* Huge walls of text
* Random decorative components
* Unnecessary UI complexity

The admin dashboard should prioritize usability over flashy design.

---

# 30. Important Development Rule

Before writing substantial code:

1. Inspect the existing repository.
2. Understand the current structure.
3. Identify existing code that can be reused.
4. Propose the architecture.
5. Identify required environment variables.
6. Identify database models.
7. Identify API modules.
8. Identify public routes.
9. Identify admin routes.
10. Then begin implementation.

Do not blindly rewrite the entire repository.

If something is unclear, make the smallest reasonable assumption and document it.

---

# 31. Expected Final Structure

A clean monorepo structure is preferred:

```text
rangamai/
│
├── apps/
│   ├── web/
│   │   └── Next.js public website
│   │
│   ├── admin/
│   │   └── Next.js admin dashboard
│   │
│   └── api/
│       └── NestJS backend
│
├── packages/
│   └── shared/
│
├── infrastructure/
│   ├── nginx/
│   ├── docker/
│   └── scripts/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

You may adjust this structure if the repository already has a better organization.

---

# 32. Final Goal

The completed system should allow this workflow:

### Initial setup

```text
Fresh AWS EC2
      ↓
Bootstrap script
      ↓
Docker
Nginx
SSL
Application
      ↓
RANGAMAI.in LIVE
```

### Normal development

```text
Local Development
      ↓
git commit
      ↓
git push
      ↓
GitHub Actions
      ↓
Automatic deployment
      ↓
RANGAMAI.in updated
```

### Server replacement

If the AWS server needs to be replaced:

```text
New Ubuntu EC2
      ↓
Bootstrap/Deployment script
      ↓
Docker + Nginx + SSL
      ↓
Connect environment variables
      ↓
Application LIVE
```

The architecture should ensure that changing the EC2 server does NOT require manually rebuilding the application environment from scratch.

The database and media must remain independent of the EC2 server.

---

# Start Here

Do NOT immediately start implementing everything.

First:

1. Inspect the repository.
2. Give me the proposed folder structure.
3. Give me the database schema design.
4. Give me the API module list.
5. Give me the public website route list.
6. Give me the admin route list.
7. Give me the deployment architecture.
8. Identify any risks or missing requirements.
9. Wait for confirmation before making major architectural changes.

After the architecture is confirmed, implement the project incrementally.
