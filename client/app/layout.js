import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import createServerAxios from "@/lib/buildAxiosServer";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wolfticketing Company",
  description: "Online ticketing system for events",
};

export default function RootLayout({ children }) {
  // let user = null;

  // // Immediately invoked async function to fetch user data
  // (async () => {
  //   user = await getUser();
  //   // console.log(user.currentUser.email); // Logs user data fetched server-side
  // })();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header getCurrentUser={getUser} />
        {children}
      </body>
    </html>
  );
}

export async function getUser() {
  const axiosServer = createServerAxios();

  try {
    // const url =
    //   typeof window === "undefined"
    //     ? "/api/users/currentUser" // Server-side URL, axios instance is already configured with baseURL
    //     : "/api/users/currentUser"; // Client-side URL, relative because the same instance handles it.

    // Since Next14 components are all server-side components
    const url = "/api/users/currentUser";
    const response = await axiosServer.get(url);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
