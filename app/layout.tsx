"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from "@/amplify_outputs.json";

const inter = Inter({ subsets: ["latin"] });

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
