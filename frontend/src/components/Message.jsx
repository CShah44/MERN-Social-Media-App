import { Flex, Text, Avatar, Image, Skeleton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

const Message = ({ message }) => {
  // const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <Flex flexDir={"column"}>
      <Flex direction={"column"} gap={2}>
        <Flex gap={2}>
          <Avatar src={message.sender.profilePic} w="7" h={7} />

          {message.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              borderRadius={"md"}
              color={"black"}
            >
              {message.text}
            </Text>
          )}
        </Flex>
        {message.img && !imgLoaded && (
          <Flex mt={5} w={"200px"}>
            <Image
              src={message.img}
              hidden
              onLoad={() => setImgLoaded(true)}
              alt="Message image"
              borderRadius={4}
            />
            <Skeleton w={"200px"} h={"200px"} />
          </Flex>
        )}

        {message.img && imgLoaded && (
          <Flex ml={9} mt={1} w={"200px"}>
            <Image src={message.img} alt="Message image" borderRadius={4} />
          </Flex>
        )}
      </Flex>
      <Text fontStyle={"italic"} mt={"1"} fontSize={"x-small"}>
        {message.sender._id === user._id ? "You" : message.sender.name}
      </Text>
    </Flex>
  );
};

export default Message;
