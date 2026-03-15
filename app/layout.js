import "./globals.css";

export const metadata = {
  title: "JARVIS",
  description: "Just A Rather Very Intelligent System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}