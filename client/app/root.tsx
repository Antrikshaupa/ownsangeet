import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import ToastContainer from "./components/Toast";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "MusicGroup",
                  "@id": "https://ownsangeet.com/#musicgroup",
                  name: "Own Sangeet",
                  alternateName: "Own Sangeet Music Studio",
                  url: "https://ownsangeet.com",
                  description:
                    "Professional custom song creation service specializing in wedding anthems, corporate jingles, and personalized music for all occasions.",
                  foundingDate: "2020",
                  foundingLocation: {
                    "@type": "Country",
                    name: "India",
                  },
                  genre: [
                    "Custom Music",
                    "Wedding Songs",
                    "Corporate Jingles",
                    "Devotional Music",
                  ],
                  sameAs: [
                    "https://wa.me/919098019901",
                    "http://OwnSangeet.com",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-9098019901",
                    contactType: "customer service",
                    availableLanguage: [
                      "English",
                      "Hindi",
                      "Punjabi",
                      "Bengali",
                      "Tamil",
                      "Telugu",
                      "Marathi",
                      "Gujarati",
                    ],
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "IN",
                    addressRegion: "India",
                  },
                  makesOffer: {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Custom Song Creation",
                      description:
                        "Professional custom song composition and production services",
                    },
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ownsangeet.com/#website",
                  url: "https://ownsangeet.com",
                  name: "Own Sangeet",
                  description:
                    "Create custom songs for weddings, corporate events, devotional occasions, and special celebrations with professional quality and fast delivery.",
                  publisher: {
                    "@id": "https://ownsangeet.com/#musicgroup",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://ownsangeet.com/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <ToastContainer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
