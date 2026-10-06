# SriramVault

SriramVault is a highly secure, tenant-isolated personal document manager built with Next.js 15, Tailwind CSS, and Supabase.

## Features
- **Strict Row Level Security (RLS)**: Documents and folders are completely isolated per user.
- **Secure File Handling**: Magic byte validation (PDF, JPG, PNG only) and 10MB limits enforced server-side.
- **Short-Lived Signed URLs**: Files are served via 60-second signed URLs to prevent public access.
- **Modern Authentication**: Supabase SSR cookies with strict HttpOnly, Secure, and SameSite policies.
- **Beautiful UI**: Modern glassmorphism UI with dark mode support built via Tailwind CSS.

---

## Windows Setup Guide

Follow these exact steps to run SriramVault on your local Windows machine.

### Prerequisites
1. **Install Node.js**: Download and install the latest LTS version of Node.js for Windows from [nodejs.org](https://nodejs.org/).
2. **Git**: Ensure Git is installed (comes with Git Bash for Windows).

### 1. Installation
Open your Command Prompt or PowerShell, navigate to your desired directory, and clone the project:

```cmd
git clone https://github.com/your-username/sriramvault.git
cd sriramvault
```

Install the required dependencies:
```cmd
npm install
```

### 2. Environment Setup
1. Create a `.env` file in the root of the project.
2. Paste your Supabase API keys into it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=http://localhost:3000
```

### 3. Start the Development Server
Run the Next.js development server:

```cmd
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be redirected to the secure login page.

---

## Deployment (Vercel)

SriramVault is optimized for Vercel deployment.

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and create a **New Project**.
3. Import your GitHub repository.
4. Go to the **Environment Variables** tab and paste the exact keys from your `.env` file (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_URL`). Update `SITE_URL` to your live Vercel domain.
5. Click **Deploy**.
6. **Important**: Go to your Supabase Dashboard -> Authentication -> URL Configuration, and add your new Vercel domain to the "Site URL" and "Redirect URLs" lists so authentication redirects work seamlessly in production.
