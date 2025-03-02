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

For a database, you can either use a local PostgreSQL instance, or you can create an external one with [prisma](https://console.prisma.io/cm76k5lgv04fom2dzj2ohv0rm/overview). Either way, you'll have a database URL you should save in a `.env` file within the `api/` directory with the following schema:

```json
DATABASE_URL=<YOUR_URL_HERE>
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

## Deployment

To build a release version of the frontend, run ```pnpm build``` within the `web/` directory.

frontend deployment:
https://crave-v3pt.onrender.com

backend deployment:
https://team-05-db.onrender.com

## Contributing

Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed.
