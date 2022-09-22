# Logging
This is the monorepo for the `@schablone/logging` package. It provides a logger 
that can be configured based on the current environment. With this you can for 
example only log traces and debug statements on the development server without 
changing any code.

## Content
See the respective package documentation for usage details.

* [`logging`](libs/logging): Base package containing all transports that do not require any
  additional dependencies. This is the only package required for basic console logging.
* [`logging-transport-sentry-browser`](libs/logging-transport-sentry-browser): Sentry transport implementation for the
  browser. Only required if logs should be sent to Sentry from a browser.
* [`logging-transport-sentry-node`](libs/logging-transport-sentry-node): Sentry transport implementation for node. 
  Only required if logs should be sent to Sentry from a node environment.

## Development
Run `yarn start` for an example with a live reload server at
localhost:4200. The example has the ability to log to a Sentry project. To enable
the sentry transport in the example, provide the environment variable `NX_SENTRY_DSN`,
e.g. by creating a `.local.env` file in the logging-react-test app and
adding the entry:

```NX_SENTRY_DSN=my-sentry-dsn```

### Dependencies
As of now NX doesn't seem to handle dependencies from which only types are imported 
correctly. Therefore, dependencies in the libs are hardcoded in their respective 
package.json files and not automatically managed by NX. Beware when adding
new dependencies or creating new libs.

### Build
Run `yarn build` to create a new build. A new build is automatically created
when a branch is pushed to github.

### New release
Merging to the `main` branch will automatically create a new release via
semantic-release.
