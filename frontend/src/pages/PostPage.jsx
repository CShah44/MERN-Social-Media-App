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
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState();
  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom);
  const { pid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          return showToast("Error", data.error, "error");
        }

        setPost(data);
      } catch (error) {
        return showToast("Error", error, "error");
      }
    };
    getPost();
  }, [showToast, pid]);

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      // todo change this to modal
      if (!window.confirm("Are you sure you want to delete the post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
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

  if (!post) return null;

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
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon cursor={"pointer"} size={20} onClick={handleDelete} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>
      {post.img && (
        <Box
          borderRadius={6}
          overflowk={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={post} />
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

      {post.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          //check if the reply is the last reply and pass it to lastReply prop use index
          lastReply={reply._id === post.replies[post.replies.length - 1]._id}
        />
      ))}
    </>
  );
};

export default PostPage;
