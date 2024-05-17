import { useRecoilValue } from "recoil";
import SignUpCard from "../components/SignUpCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return (
    <>
      <SignUpCard />
    </>
  );
};

export default AuthPage;
