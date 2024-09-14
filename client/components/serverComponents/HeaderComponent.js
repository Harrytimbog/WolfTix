import { getCurrentUser } from "@/app/actions/getCurrentUser";
import wrapCurrentUser from "../hoc/getCurrentUser";
import Header from "../Header";

const HeaderComponent = ({ currentUser }) => {
  // const currentUser = await getCurrentUser();
  return (
    <div>
      <Header currentUser={currentUser} />
    </div>
  );
};

export default wrapCurrentUser(HeaderComponent);
