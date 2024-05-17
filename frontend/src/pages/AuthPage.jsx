import { useRecoilValue } from "recoil";
import SignUpCard from "../components/SignUpCard";
import authScreenAtom from "../atoms/authAtom";
import LoginCard from "../components/LoginCard";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return <>{authScreenState === "login" ? <LoginCard /> : <SignUpCard />} </>;
};

export default AuthPage;
