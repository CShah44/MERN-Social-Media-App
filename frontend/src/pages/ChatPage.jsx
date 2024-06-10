import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import CreateConversationButton from "../components/CreateConversationButton";
import { useRecoilState } from "recoil";
import { conversationsAtom } from "../atoms/conversationAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const ChatPage = () => {
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [loadingConv, setLoadingConv] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getConv = async () => {
      try {
        const response = await fetch("/api/messages/");
        const data = await response.json();

        if (data.error)
          return showToast(
            "Error",
            "Couldn't fetch your conversations!",
            "error"
          );

        setConversations(data);
      } catch (error) {
        showToast("Error", "Couldn't fetch your conversations!", "error");
      } finally {
        setLoadingConv(false);
      }
    };

    getConv();
  }, [setConversations, showToast]);

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{ base: "100%", md: "80%", lg: "850px" }}
      p={"4"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "100%",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={"700"}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for chat" />
              <Button size={"md"}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          <Flex>
            <CreateConversationButton />
          </Flex>
          {loadingConv && !conversations && (
            <Flex>
              <Spinner />
            </Flex>
          )}
          {conversations &&
            !loadingConv &&
            conversations.map((c) => (
              <Conversation conversation={c} key={c._id} />
            ))}
          {!loadingConv && !conversations.length && (
            <Text size={"sm"}>You have no conversations! Create One!</Text>
          )}
        </Flex>
        {/* <Flex
          flex={70}
          borderRadius={"md"}
          p={2}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"400px"}
        >
          <GiConversation size={100} />
          <Text fontSize={20}>Select a conversation to start messaging</Text>
        </Flex> */}
        <MessageContainer />
      </Flex>
    </Box>
  );
};

export default ChatPage;
