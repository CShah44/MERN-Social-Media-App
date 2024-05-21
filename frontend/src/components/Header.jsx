import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authAtom from "../atoms/authAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {currentUser && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!currentUser && (
        <Link as={RouterLink} to="/" onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {currentUser && (
        <Link as={RouterLink} to={`${currentUser.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}
      {!currentUser && (
        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreen("signup")}
        >
          Sign Up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
