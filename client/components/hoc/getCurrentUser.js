import { getCurrentUser } from "@/app/actions/getCurrentUser";

const currentUser = await getCurrentUser();

const wrapCurrentUser = (WrappedComponent) => {
  return (props) => {
    return <WrappedComponent {...props} currentUser={currentUser} />;
  };
};

export default wrapCurrentUser;
