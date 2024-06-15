import {
  CloseButton,
  Flex,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsImageFill } from "react-icons/bs";

const MessageInput = () => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [isSending, setIsSending] = useState(false);

  const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const fileRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText && !imgUrl)
      return showToast("Error", "Type something or select an image", "error");
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: messageText,
          conversationId: selectedConversation._id,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setImgUrl("");
      setIsSending(false);
    }
  };

  return (
    <>
      <Flex gap={2} alignItems={"center"}>
        <form onSubmit={handleSendMessage} style={{ flex: 95 }} width={"full"}>
          <InputGroup>
            <Input
              w={"full"}
              placeholder="Type a message"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
            <Flex px={3} alignItems={"center"} gap={2} cursor={"pointer"}>
              {isSending ? (
                <Spinner />
              ) : (
                <>
                  <IoSendSharp onClick={handleSendMessage} />
                  <br />
                  <BsImageFill onClick={onOpen} />
                </>
              )}
            </Flex>
          </InputGroup>
        </form>
      </Flex>
      {imgUrl && (
        <Text p={"2"} fontSize={"sm"} w="full">
          Image is selected.
        </Text>
      )}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add photo to your image</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            minHeight={"200px"}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
          >
            <Input
              type={"file"}
              hidden
              ref={fileRef}
              onChange={handleImgChange}
            />
            <BsImageFill
              style={{ marginLeft: "5px", cursor: "pointer" }}
              size={16}
              onClick={() => fileRef.current.click()}
            />
            {imgUrl && (
              <Flex
                my={5}
                w="full"
                position={"relative"}
                flexDirection={"column"}
              >
                <Text mb={"2"}>Selected Photo</Text>
                <Image src={imgUrl} alt="Selected image" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={10}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageInput;
