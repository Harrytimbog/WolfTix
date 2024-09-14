import { getCurrentUser } from "@/app/actions/getCurrentUser";

const wrapCurrentUser = async (WrappedComponent) => {
  const currentUser = await getCurrentUser();
  console.log("from wrapCurrentUser", currentUser);
  return (props) => {
    return <WrappedComponent {...props} currentUser={currentUser} />;
  };
};

export default wrapCurrentUser;
