import {
  Avatar,
  Flex,
  //   Image,
  Stack,
  Text,
  WrapItem,
  //   useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
// import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/conversationAtom";
import userAtom from "../atoms/userAtom";

const Conversation = ({ conversation }) => {
  const lastMessage = conversation.lastMessage;
  const currentuser = useRecoilValue(userAtom);
  const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
  // const colorMode = useColorMode();

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() => setSelectedConversation(conversation)}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={"https://bit.ly/broken-link"}
        />
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {conversation.groupName}
        </Text>

        {lastMessage && (
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {lastMessage.sender._id === currentuser._id
              ? "You"
              : lastMessage.sender.name}{" "}
            : {lastMessage.text.substring(0, 14)}
          </Text>
        )}
      </Stack>
    </Flex>
  );
};

export default Conversation;
