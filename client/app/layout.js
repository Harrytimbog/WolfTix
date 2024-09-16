import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header";
import { getCurrentUser } from "./actions/getCurrentUser";
import { UserProvider } from "./context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wolfticketing Company",
  description: "Online ticketing system for events",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getCurrentUser();
  return (
    <html lang="en">
      <UserProvider initialUser={currentUser}>
        <body className={inter.className}>
          <Header />
          <div className="container">{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
