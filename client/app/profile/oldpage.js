import React from "react";

import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies["session"];

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    return {
      props: { user: decoded }, // Pass user data to the page component
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

const ProfilePage = ({ user }) => {
  console.log(user);
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
};
export default ProfilePage;
