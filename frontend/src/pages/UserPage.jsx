import Post from "../components/Post";
import UserHeader from "../components/UserHeader";

export default function UserPage() {
  return (
    <>
      <UserHeader />
      <Post
        postImg={"/post1.png"}
        postTitle={"HELLO BROTHER"}
        likes={3}
        replies={4}
      />
    </>
  );
}
