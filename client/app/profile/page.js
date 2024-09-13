import UserProfile from "@/components/userProfile";
import wrapCurrentUser from "@/components/hoc/getCurrentUser";

const ProfilePage = ({ currentUser }) => {
  const loggedInUser = currentUser.currentUser;

  // console.log({ "from profile page": loggedInUser });
  return <UserProfile currentUser={loggedInUser} />;
};

export default wrapCurrentUser(ProfilePage);
