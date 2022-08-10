import { LoggerFactory } from '@alchemisten/logging';
import { SentryBrowserTransport } from '@alchemisten/logging-transport-sentry-browser';

const logger = LoggerFactory({
	environment: 'local',
	transports: [
		new SentryBrowserTransport({
			sentryConfig: {
				dsn: 'https://2403a222dc334e5a8a123e037b8e2a9e@o564898.ingest.sentry.io/6634249',
			},
		}),
	],
});

export function App() {
	const handleClick = () => {
		logger.error('Bre');
	};
	return <div onClick={handleClick}>Click me</div>;
}

export default App;
