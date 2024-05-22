import { Container, Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";
import UpdateUserPage from "./pages/UpdateUserPage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Box position={"relative"} w="full">
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateUserPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              <>
                <UserPage />
                {user && <CreatePost />}
              </>
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        {user && <LogoutButton />}
      </Container>
    </Box>
  );
}

export default App;
