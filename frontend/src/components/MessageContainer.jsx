import {
  Flex,
  useColorModeValue,
  Text,
  Divider,
  Skeleton,
  SkeletonCircle,
  Avatar,
} from "@chakra-ui/react";
import MessageInput from "./MessageInput";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Message from "../components/Message";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const user = useRecoilValue(userAtom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = useShowToast();
  const messageEndRef = useRef(null);

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.img ? "Image" : message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [selectedConversation._id, socket, setConversations]);

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

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "gray.dark")}
      maxH={"570px"}
      borderRadius={"md"}
      p={2}
      alignContent={"space-between"}
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
        <Avatar src={selectedConversation.groupPhoto || ""} size={"sm"} />
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
            <Flex
              key={m._id}
              ref={
                messages.length - 1 === messages.indexOf(m)
                  ? messageEndRef
                  : null
              }
              direction={"column"}
            >
              <Message message={m} />
            </Flex>
          ))}
      </Flex>
      <MessageInput />
    </Flex>
  );
};

export default MessageContainer;
