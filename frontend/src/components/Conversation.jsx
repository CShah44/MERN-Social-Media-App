import {
  Avatar,
  AvatarBadge,
  Flex,
  //   Image,
  Stack,
  Text,
  WrapItem,
  //   useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// import { useRecoilValue, useRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
// import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation }) => {
  //   const user = conversation.participants[0];
  //   const currentUser = useRecoilValue(userAtom);
  // const lastMessage = conversation.lastMessage;
  // const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  // const colorMode = useColorMode();

  // console.log("selectedConverstion", selectedConversation);
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
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          // src={user.profilePic}
          src={"https://bit.ly/broken-link"}
        >
          <AvatarBadge boxSize="1em" bg="green.500" />{" "}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {conversation.groupName}
        </Text>
        {/* <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          Hello some message ...
        </Text> */}
      </Stack>
    </Flex>
  );
};

export default Conversation;
