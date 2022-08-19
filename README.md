# Logging
This is the monorepo for the `@schablone/logging` package.

## Content
See the respective package documentation for usage details.

* [`logging`](libs/logging): Base package containing all transports that do not require any
  additional dependencies.
* [`logging-transport-sentry-browser`](libs/logging-transport-sentry-browser): Sentry transport implementation for the
  browser. Only required if logs should be sent to Sentry from a browser.
* [`logging-transport-sentry-node`](libs/logging-transport-sentry-node): Sentry transport implementation for node. 
  Only required if logs should be sent to Sentry from a node environment.

## Development
Run `yarn start` for an example with a live reload server at
localhost:4200. The example has the ability to log to a [sentry test project](https://sentry.io/organizations/alchemisten/issues/?project=6634249).

### Build
Run `yarn build` to create a new build. A new build is automatically created
when a branch is pushed to gitlab.

### New release
Merging to the `main` branch will automatically create a new release via
semantic-release.
