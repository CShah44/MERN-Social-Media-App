import {
  Box,
  // Button,
  Flex,
  Input,
  InputGroup,
  // InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import CreateConversationButton from "../components/CreateConversationButton";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const ChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const selectedConversation = useRecoilValue(selectedConversationAtom);

  const [loadingConv, setLoadingConv] = useState(true);
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value.toLowerCase());
    const filteredConversations = conversations.filter((conversation) => {
      const conversationName = conversation.groupName.toLowerCase();
      return conversationName.includes(searchTerm);
    });
    setFilteredConversations(filteredConversations);
  };

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
              <InputGroup>
                <Input
                  placeholder="Search for chat"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  onBlur={() => setSearchTerm("")}
                />
              </InputGroup>
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
          {searchTerm &&
            filteredConversations &&
            !loadingConv &&
            filteredConversations.map((c) => (
              <Conversation conversation={c} key={c._id} />
            ))}
          {!searchTerm && !conversations && (
            <Text size={"sm"}>You have no conversations! Create One!</Text>
          )}
          {!searchTerm &&
            conversations &&
            conversations.map((c) => (
              <Conversation conversation={c} key={c._id} />
            ))}
        </Flex>
        {!selectedConversation && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
