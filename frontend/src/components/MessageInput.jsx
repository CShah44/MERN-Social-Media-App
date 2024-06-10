import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";

const MessageInput = () => {
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Type a message" />

        <InputRightElement>
          <IoMdSend />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
