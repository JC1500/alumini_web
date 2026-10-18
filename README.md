
# Alumini — Alumni Networking Platform

Alumini is an alumni networking platform designed to help people reconnect with their college community, discover fellow alumni, explore career journeys, and build meaningful professional connections.

Users can create professional profiles, search for alumni, and view other members' profiles.

## ✨ Features

- **Authentication:** Sign up, sign in, and sign out using Clerk.
- **Alumni Profiles:** Create and update personal alumni profiles.
- **Public Profiles:** View other alumni profiles using their usernames.
- **Alumni Search:** Search by name, username, company, or department.
- **Responsive Design:** Interface built with Tailwind CSS.
- **Database:** PostgreSQL database hosted on Supabase.
- **ORM:** Prisma for database queries and schema migrations.

## 🛠️ Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Clerk Authentication (Core 3)
- PostgreSQL
- Supabase
- Prisma ORM 7
- pnpm

## 📋 Prerequisites

Before running the project, install the following:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

Use the same Node.js and pnpm versions as the main project whenever possible. Check `package.json` for the `packageManager` field.

Verify your installations:

```bash
node -v
npm -v
git --version
pnpm -v
```

## 🚀 Getting Started

Follow these steps to run Alumini locally.

### 1. Clone the Repository

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with the actual GitHub repository details.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

If the repository is private, you must have permission to access it.

### 2. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Configure Environment Variables

Create the environment files in the project root.

You can use the example files as templates if they are available:

```powershell
Copy-Item .env.example .env
Copy-Item .env.local.example .env.local
```

If the example files do not exist, create `.env` and `.env.local` manually.

#### `.env`

Add your PostgreSQL connection URLs:

```env
DATABASE_URL="YOUR_DATABASE_CONNECTION_URL"
DIRECT_URL="YOUR_DIRECT_DATABASE_CONNECTION_URL"
```

These URLs should point to a PostgreSQL database accessible to your development machine.

#### `.env.local`

Add your Clerk and Supabase project configuration:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"

NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"
```

Replace every placeholder with the appropriate value from your own development projects.

**Important:**

- Create your own Clerk development application and configure its sign-in and sign-up URLs.
- Create your own Supabase project, or obtain authorized access to a shared development database.
- Keep secret keys and database credentials private.
- Never commit `.env` or `.env.local` to GitHub.
- If the application uses additional environment variables, configure those as well.

### 4. Generate the Prisma Client

Generate the Prisma client from the schema:

```bash
pnpm exec prisma generate
```

The project uses Prisma 7, so keep the existing `prisma/schema.prisma` and `prisma.config.ts` configuration intact.

### 5. Set Up the Database

Ensure that your database URLs are configured correctly and the database is accessible.

Apply the existing migrations:

```bash
pnpm exec prisma migrate dev
```

This creates or updates the database schema using the migrations committed to the repository.

**Important:** The `prisma/migrations/` directory must be included in Git. Do not create a new initial migration if the project already contains its migration history.

If there are no committed migrations, the project maintainer should create and commit the initial migration before other developers set up their databases.

### 6. Start the Development Server

Run:

```bash
pnpm dev
```

Open the application in your browser:

[http://localhost:3000](http://localhost:3000)

You can now register an account, create an alumni profile, search for alumni, and view public profiles.

## 📁 Project Structure

The project uses the Next.js App Router with a root-level `app/` directory.

```text
alumini_web/
├── app/
│   ├── actions/
│   │   └── profile.ts
│   ├── components/
│   │   └── navbar.tsx
│   ├── me/
│   │   ├── page.tsx
│   │   ├── profile-form.tsx
│   │   └── profile-view.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── u/
│   │   └── [username]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── search-bar.tsx
├── lib/
│   ├── generated/
│   │   └── prisma/
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── .env.example
├── .env.local.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── proxy.ts
├── README.md
└── tsconfig.json
```

The structure above represents the main files and directories. Some files may differ as the project evolves.

## 🧑‍💻 Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server after a build |
| `pnpm lint` | Run the lint script if configured in `package.json` |
| `pnpm exec prisma generate` | Generate the Prisma client |
| `pnpm exec prisma migrate dev` | Apply development database migrations |
| `pnpm exec prisma validate` | Validate the Prisma schema |

## 🔐 Security Guidelines

- Never commit `.env` or `.env.local`.
- Never expose `CLERK_SECRET_KEY` or database credentials in client-side code.
- Use `NEXT_PUBLIC_` only for values intentionally exposed to the browser.
- Keep Prisma queries and database access in server-side code.
- Use Clerk's authenticated user ID when creating or updating a user's profile.
- Do not trust a user ID supplied by a client when deciding whose profile to update.
- Public profile pages should return only information intended to be publicly visible.

## 🤝 Contributing

Contributions and improvements are welcome.

1. Fork the repository or create a feature branch.
2. Make your changes.
3. Test your changes locally.
4. Commit your work with a meaningful commit message.
5. Open a pull request for review.

Example:

```bash
git checkout -b feat/new-feature
git add .
git commit -m "feat: add new feature"
git push -u origin feat/new-feature
```

## 📄 License

Add your chosen open-source license here before distributing the project publicly.

---

Built to keep alumni connected.
