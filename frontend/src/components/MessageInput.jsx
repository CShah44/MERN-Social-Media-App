import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IOSendSharp } from "react-icons/io";

const MessageInput = () => {
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Type a message" />

        <InputRightElement>
          <IOSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
