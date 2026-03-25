import * as Sentry from '@sentry/node';

let enabled = false;

export function initMonitoring() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log('Sentry monitoring disabled (SENTRY_DSN not set)');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  });
  enabled = true;
  console.log('Sentry monitoring enabled');
}

export function captureError(err, req) {
  if (!enabled) return;
  Sentry.captureException(err, {
    user: req?.user?.id ? { id: String(req.user.id), role: req.user.role } : undefined,
    tags: {
      method: req?.method,
      path: req?.path,
    },
  });
}
