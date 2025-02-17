"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {children}
        </Authenticator>
      </body>
    </html>
  );
}
