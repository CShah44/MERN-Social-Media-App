import {
  Flex,
  Image,
  Text,
  Avatar,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom);
  const { pid } = useParams();
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          return showToast("Error", data.error, "error");
        }

        setPosts([data]);
      } catch (error) {
        return showToast("Error", error, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      // todo change this to modal
      if (!window.confirm("Are you sure you want to delete the post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        return showToast("Error!", data.error, "error");
      }

      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      return showToast("Error", error, "error");
    }
  };

  if (!user && loading)
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size="xl" />
      </Flex>
    );

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Mark" />
          <Flex>
            <Text fontWeight={"bold"} fontSize={"sm"}>
              {user.name}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon cursor={"pointer"} size={20} onClick={handleDelete} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflowk={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          //check if the reply is the last reply and pass it to lastReply prop use index
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
