import SigninForm from "@/components/signinForm";
import wrapCurrentUser from "@/components/hoc/getCurrentUser";

const SignInPage = async ({ currentUser }) => {
  // console.log({ "from signin page": currentUser });
  return <SigninForm currentUser={currentUser} />;
};

export default wrapCurrentUser(SignInPage);
