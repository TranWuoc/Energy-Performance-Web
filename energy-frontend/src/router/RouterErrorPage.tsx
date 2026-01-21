import { useRouteError } from 'react-router-dom';

export default function RouterErrorPage() {
    const error = useRouteError() as any;

    return (
        <div style={{ padding: 24 }}>
            <h2>Route crashed ❌</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{error?.message || JSON.stringify(error, null, 2)}</pre>
            {error?.stack && <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.8 }}>{error.stack}</pre>}
        </div>
    );
}
