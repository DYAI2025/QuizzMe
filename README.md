# Personality & Horoscope Platform

A scalable Next.js application that hosts two distinct verticals from a single codebase:

1. **Quiz Vertical**: Personality tests, psychology, and self-discovery.
2. **Horoscope Vertical**: Astrology, daily horoscopes, and destiny checks.

## Features

- **Multi-Domain Support**: Uses `middleware.ts` to route traffic based on hostname (e.g., `quiz.com` vs `horoscope.com`) or defaults to the Quiz vertical.
- **Shared Design System**: Built with Tailwind CSS, sharing utility classes but maintaining distinct visual themes for each vertical.
- **Interactive Quizzes**:
  - **Love Languages**: Discover your primary love language.
  - **Destiny Quiz**: Find your inner calling (Auserwählter, Architekt, etc.).
  - **Celebrity Soulmate**: Who is your famous match?
  - **Personality / Social Role**: Deep dive into your character traits.
  - **RPG Identity**: What fantasy class are you?

## Project Structure

- `src/app/verticals`: Contains the page logic for each vertical.
  - `/quiz`: Landing page and quiz sub-pages.
  - `/horoscope`: Horoscope landing page, sign details, and destiny quiz.
- `src/components/quizzes`: Reusable React components for each quiz.
- `src/middleware.ts`: Handles the routing logic.

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

   *Tip: To test the Horoscope vertical locally without domain configuration, you can modify `middleware.ts` to default to `horoscope` or simply navigate to `/verticals/horoscope` explicitly.*

3. **Build fo Production**:

   ```bash
   npm run build
   npm run start
   ```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
