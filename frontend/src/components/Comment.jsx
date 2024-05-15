import { Avatar, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

// can add dummy props here
const Comment = () => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src="/zuck-avatar.png" size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              Markzucker
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize="sm" color={"gray.light"}>
                ID
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>This is a reply</Text>
          {/* <Actions /> */}
          <Text fontSize={"sm"} color={"gray.light"}>
            101 likes
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Comment;
