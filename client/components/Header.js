import Link from "next/link";
import wrapCurrentUser from "./hoc/getCurrentUser";

const Header = async ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/signup" },
    !currentUser && { label: "Sign In", href: "/signin" },
    currentUser && { label: "Sign Out", href: "/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li key={href} className="mx-3">
        <Link href={href} className="nav-item text-decoration-none">
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          WolfTix
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

export default wrapCurrentUser(Header);
