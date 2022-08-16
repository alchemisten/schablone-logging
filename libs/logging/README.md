# Logger
Provides an out-of-the-box logging service, which logs all messages with their
level to the console by default. It can be configured via options at initialization, 
including adding other transports than console logging.

## Installation
`yarn add @alchemisten/logging` or `npm install @alchemisten/logging`

## Usage

```typescript
import LoggerFactory from '@alchemisten/logging';

const logger = LoggerFactory({
  environment: 'local',
  globalLogOptions: {
    callback: (data) => {
      const { error, level, message, meta, objects } = data;
      // Use data in some way
    },
    meta: {
      name: 'Bob',
      job: 'Tester',
    },
    tags: ['GlobalTag'],
  },
});
logger.debug("This is a debug message");
```

### Parameters
The `LoggerFactory` object can receive an optional object as a parameter upon
initialization. The object can have the following optional properties
* `environment` string ('production') Type of the environment the
  application is running on. Accepts 'local', 'develop', 'staging' and 'production'.
* `globalLogOptions` GlobalLogOptions (undefined) An options object containing
  configuration for the logged messages. Options set here will be applied to
  all transports and logs and merged with their respective log options.
  * `tags`: string[] (undefined): A list of tags help to group log messages. How the
    tags are used depends on the transports. Tags supplied in individual log message 
    options will be concatenated with these global tags and filtered to be unique.
  * `meta`: Record<string, unknown> (undefined): An object containing any additional
    data. How the meta information will be made available depends on the transport.
  * `callback`: (data: CallbackData): void callback that will be called by each
    transport after logging a message. Global callbacks will be overridden by
    callbacks in individual log message options.
    CallbackData comprises the following information:
    * `error`: unknown (optional) The error object supplied to the log, if any
    * `level`: string The level of the log
    * `message`: string The message of the log
    * `meta`: Record<string, unknown> (optional) The meta object supplied to the 
      log, if any
    * `objects` unknown | unknown[] (optional) Any objects supplied to the log, 
      if any
* `transports` ITransport[] (new ConsoleTransport()): An array of transport 
  instances to which the logger should send all logged messages. By default,
  all messages are logged to the console. If any transports are provided here
  the default transport will not be created and a console transport has to 
  added manually.


### API
All logging types accept a LogOptions object as an optional parameter.

#### `trace(message: string, options?: LogOptions): void`
Writes a message at the TRACE level. Used for detailed debugging information
with the highest granularity, contains a stacktrace.

#### `debug(message: string, options?: LogOptions): void`
Writes a message at the DEBUG level

#### `info(message: string, options?: LogOptions): void`
Writes a message at the INFO level

#### `warn(message: string, options?: LogOptions): void`
Writes a message at the WARN level. Used for faulty configuration and 
unexpected data that can be safely defaulted and does not hinder the 
application from running normally. 

#### `error(message: string, options?: LogOptions): void`
Writes a message at the ERROR level. Used for errors that inhibit parts 
of an applications normals functionality, contains a stacktrace.

#### `fatal(message: string, options?: LogOptions): void`
Writes a message at the FATAL level. Used for error the application 
can't recover from, contains a stacktrace.

#### `withOptions(options: LoggerOptions): ILogger`
Returns a new logger instance based on the original logger. The supplied
options will be deepmerged with the options of the original logger, 
overriding them if they can't be merged.

## Transports
Transports are the different targets a message will be logged to. Transports
that do not require additional dependencies are contained in the logging package. 
All transports that have additional dependencies (like Sentry) are implemented 
as individual packages. 

Each transport has an EnvironmentLevelMap which governs which log levels 
are logged in the current environment. The environments are ordered, meaning
a log level that is set to `production` will also show up in all other 
environments, but a log level set to `develop` will not show up in `staging`
or `production`.

All transports can receive a configuration object on initialization. For the
exact specifications of these objects, see the respective transport documentation.
Each transport configuration object will at least accept the following options:
* `environmentLevelMap`: EnvironmentLevelMap (optional) An object mapping the log
  levels to the environment they should be logged in. See below for examples
* `transortLogOptions`: GlobalLogOptions (optional) See the LoggerFactory's
  globalLogOptions for details

### Console transport
Logs to the console. In a node environment the logs will be color coded. 
Messages will be prepended by all tags and the level. Any objects or error 
will be appended to the message, while meta information is not displayed 
and only available in the callback.

Default EnvironmentLevelMap:
* fatal: production
* error: production
* warn: production
* info: staging
* debug: develop
* trace: local

### Sentry transport
Logs to a sentry server. The sentry transport is only implemented as an 
abstract class and required either the [SentryNodeTransport](../logging-transport-sentry-node) or the 
[SentryBrowserTransport](../logging-transport-sentry-browser) package in addition to the logging package.

The level, environment and meta information are all pushed to Sentry with
each message. The tags array is converted to a Record, where each tag is a
key with the value 'Group'. Objects are not send to Sentry, but are 
available in the callback.

In addition to the default initialization options, the object passed at the
SentryTransport's initialization needs a SentryConfig. This can be a
BrowserOptions or NodeOptions object and needs to supply a dsn. See the 
SentryNodeTransport or SentryBrowserTransport packages for examples or 
[Sentry documentation](https://docs.sentry.io/platforms/javascript/configuration/options/) for the full details.

Default EnvironmentLevelMap:
* fatal: production
* error: production
* warn: staging
* info: never
* debug: never
* trace: never
