import { useEffect, useState } from "react";
import Post from "../components/Post";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, {
          method: "GET",
        });

        const data = await res.json();

        if (data.error && data.error.length < 500) {
          return showToast("Error!", data.error, "error");
        }

        setUser(data);
      } catch (error) {
        return showToast("Error!", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

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
      <Post
        postImg={"/post1.png"}
        postTitle={"HELLO BROTHER"}
        likes={3}
        replies={4}
      />
    </>
  );
}
