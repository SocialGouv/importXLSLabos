import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: "XXX",
  environment: "",
});

export function capture(err) {
  if (Sentry && err) {
    console.error(err);
    Sentry.captureException(err);
  }
}
