import type { NextPage, NextPageContext } from "next";
import Link from "next/link";

type ErrorPageProps = {
  statusCode?: number;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const title = statusCode ? `${statusCode} Error` : "Application Error";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </p>
      <h1 className="font-display text-4xl tracking-wide">
        SOMETHING WENT WRONG
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The app hit an unexpected error. Try refreshing the page or return home.
      </p>
      <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Return home
      </Link>
    </main>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default ErrorPage;