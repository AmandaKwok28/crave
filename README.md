# OOSE Team Project

Crave - A recipe sharing app for college students

- [Team Information & Agreement](./docs/team-agreement.md)
- [Requirements Specification](./docs/requirements-specification.md)
- [Project Roadmap](./docs/roadmap.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Installing / Getting started

### Prerequisites & Setup

Make sure you have [node](https://nodejs.org/en) and [pnpm](https://pnpm.io/) installed. Make sure they are up-to-date as older versions of node may not be supported. You may want to install [PostgreSQL](https://www.postgresql.org/) to run a local database for development.

Next, clone the repository and navigate to the `web/` folder and run `pnpm install` and `pnpm dev` to start the frontend client.

Then, navigate to the `api/` folder and run `pnpm install`

For a database, you can either use a local PostgreSQL instance, or you can create an external one with [prisma](https://console.prisma.io/cm76k5lgv04fom2dzj2ohv0rm/overview). Either way, you'll have a database URL you should save in a `.env` file. 

Furthermore, you need to provide your own OpenAI API key to use our AI-powered features. If you don’t have one, you can get it from OpenAI's API key page. If you're testing the app without using AI features, you can leave OPEN_AI_KEY empty or use a placeholder value.

Within the `api/` directory, save a `.env` file with the following schema:

```json
DATABASE_URL=<YOUR_URL_HERE>
OPEN_AI_KEY=<YOUR_OPENAI_API_KEY_HERE>
```

## Developing

Starting from the root folder, you can run these commands:

```bash
cd ./api
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm run dev

cd ../web
pnpm install
pnpm run dev
```

Additionally, in the api folder, create a .env file with the following:

```DATABASE_URL=<database_api_url>```

## Testing

Normally, testing is ran automatically on any pull request to `dev` or `master`. For the time being, this functionality is restricted and testing must be done locally.

### Backend Testing

Backend tests are run using [Vitest](https://vitest.dev/). Simply navigate to the `api/` directory and (assuming all development prerequisites are currently installed) run the following:

```bash
pnpm test
```

Adding additional backend tests is extremely easy. Simply create a new file in the `api/src/__tests__/` directory that ends in `.test.ts` and it will automatically be detected by Vitest. At the top of the file, make sure you copy the Mock Prisma client initialization code:

```typescript
vi.mock('../../prisma/db', async () => {
  return {
    ...await vi.importActual<typeof import('../lib/__mocks__/prisma')>('../lib/__mocks__/prisma')
  };
});
```

Otherwise, tests can be written according to Vitest docs.

### Frontend & E2E Testing

Frontend & E2E tests are run using [Cypress](https://www.cypress.io/). First, both the backend and frontend servers must be running (refer back to `## Developing`). Then, simply navigate to the `web/` directory and (assuming all development prerequisites are currently installed) run the following:

```bash
pnpm test
```

Adding additional frontend & E2E tests is also easy. Navigate to the `web/cypress/e2e/` directory and create a file ending in `.cy.js`. From there, tests can be constructed according to Cypress docs. Some global Cypress helper functions are provided and documented in the `web/cypress/support/commands.ts` file.

## Deployment

To build a release version of the frontend, run ```pnpm build``` within the `web/` directory, and then run `pnpm preview` to check out the build before deployment.

frontend deployment: <https://crave-v3pt.onrender.com>

backend deployment: <https://team-05-db.onrender.com>

## Contributing

Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed.
