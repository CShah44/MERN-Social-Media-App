import {
  Flex,
  useColorModeValue,
  Text,
  Divider,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import MessageInput from "./MessageInput";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/conversationAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Message from "../components/Message";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = useShowToast();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();

        if (data.error)
          return showToast("Error", "Could not load messages", "error");

        setMessages(data);
      } catch (error) {
        showToast("Error", "Could not load messages", "error");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation._id]);

  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex
        w={"full"}
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        px="3"
      >
        {/* <Avatar
          src=""
          group photo yaha pe
          size={"sm"}
        /> */}
        <Text
          size="md"
          fontWeight={"600"}
          display={"flex"}
          alignItems={"center"}
        >
          {selectedConversation.groupName}
        </Text>
        <Text color={"gray.500"} fontStyle={"italic"} size="xs">
          {selectedConversation.participants
            .map((p) => (p.name === user.name ? "You" : p.name))
            .join(", ")}
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {loading &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loading &&
          messages &&
          messages.map((m) => (
            <Message
              key={m._id}
              ownMessage={m.sender.username === user.username}
              message={m}
            />
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
