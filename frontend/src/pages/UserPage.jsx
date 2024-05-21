import { useEffect, useState } from "react";
// import Post from "../components/Post";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

export default function UserPage() {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/posts/user/" + username);
        const data = await res.json();

        if (data.error) {
          return showToast("Error!", data.error, "error");
        }

        setPosts(data);
      } catch (error) {
        setPosts([]);
        return showToast("Error!", error, "error");
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts]);

  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" mx="auto" />
      </Flex>
    );

  if (!user) return <h1> User not found. </h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((p) => (
        <Post post={p} userId={p.postedBy} key={p._id} />
      ))}
    </>
  );
}
