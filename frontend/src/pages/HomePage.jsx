import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeed = async () => {
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) {
          return showToast("error", data.error, "error");
        }

        setPosts(data);
      } catch (error) {
        showToast("Error", "Error getting feed", "error");
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [showToast, setPosts]);

  return (
    <>
      {loading && (
        <Flex justify="center">
          <Spinner />
          <Text fontSize={"sm"}>Your personalized feed is loading.</Text>
        </Flex>
      )}
      {!loading && posts.length == 0 && (
        <Flex h={"full"} alignItems={"center"} justify="center">
          <Text as="h1"> Follow some users to see their posts!</Text>
        </Flex>
      )}
      {!loading &&
        posts.length > 0 &&
        posts.map((p) => <Post key={p._id} post={p} userId={p.postedBy} />)}
    </>
  );
};

export default HomePage;
