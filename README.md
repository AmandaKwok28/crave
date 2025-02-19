# OOSE Team Project

Name of the application goes here -- followed by a brief description (elevator pitch) of the application.

- [Team Information & Agreement](./docs/team-agreement.md)
- [Requirements Specification](./docs/requirements-specification.md)
- [Project Roadmap](./docs/roadmap.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Installing / Getting started

1. **Prerequisites**: Make sure you have Node, and PNPM installed. If you don’t have PNPM, you can install it globally with `npm install -g pnpm`. Additionally, in order to clone the project, you will need a Github Account.
2. **Repository Setup**: Clone the repository and navigate to the root folder in the terminal.
3. **Dependencies**: Run `pnpm install` to install the dependencies for both the client and server.
4. **Environment Configuration**:
   Add a `.env` file in each the `app` and `api` sub-folders. You will need to fill in the required environment variables: DATABASE_URL
   visit: https://console.prisma.io/cm76k5lgv04fom2dzj2ohv0rm/overview to create your own postgress database and get an api key to add to your .env file as the DATABASE_URL


## Developing

```
cd api
pnpm install
pnpm run dev

cd web
pnpm install
pnpm run dev
```
in the api folder 
create a .env file
add DATABASE_URL = *database api key*

to build and release a new version run:

```
cd web
pnpm build
```

## Deployment
frontend deployment:
https://team-05.onrender.com

backend deployment:
https://crave-dcgp.onrender.com/users

## Contributing

Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed.