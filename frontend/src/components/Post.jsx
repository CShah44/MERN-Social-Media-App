import { Flex, Box, Avatar, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";

import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, userId }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  if (post.repost) console.log(post);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${userId}`);
        const data = await res.json();

        if (data.error) {
          return showToast("Error!", data.error, "error");
        }

        setUser(data);
      } catch (error) {
        showToast("Error!", error, "error");
        setUser(null);
      }
    };

    getUser();
  }, [userId, showToast]);

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

      const updatedPosts = posts.filter((p) => p !== post._id);

      setPosts(updatedPosts);
      showToast("Success", "Post deleted", "success");
    } catch (error) {
      return showToast("Error", error, "error");
    }
  };

  if (!user) return null;

  return (
    <Link
      to={`/${
        post.repost ? post.repost.originalPostedBy.username : user.username
      }/post/${post._id}`}
    >
      {post.repost && (
        <Flex gap={2} py={2}>
          <Text fontSize={"sm"} fontStyle={"italic"}>
            Reposted by {user.username}
          </Text>
        </Flex>
      )}
      <Flex gap={3} mb={4} pb={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={
              post.repost
                ? post.repost.originalPostedBy.profilePic
                : user.profilePic
            }
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={post.replies[0].username}
                src={post.replies[0].profilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name={post.replies[1].username}
                src={post.replies[1].profilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name={post.replies[2].username}
                src={post.replies[2].profilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {post.repost
                  ? post.repost.originalPostedBy.username
                  : user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
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
                <DeleteIcon
                  cursor={"pointer"}
                  size={20}
                  onClick={handleDelete}
                />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
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
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
