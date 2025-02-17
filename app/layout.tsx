"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import NavBar from "@/components/navBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en">
      <body>
        <Authenticator>
          {/* <NavBar /> */}
          {children}
        </Authenticator>
      </body>
    </html>
  );
}
