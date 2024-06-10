import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  CheckboxGroup,
  Input,
  Flex,
  Spinner,
  Text,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { conversationsAtom } from "../atoms/conversationAtom";

const CreateConversationButton = () => {
  const [loadingCreateCon, setLoadingCreateCon] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followers, setFollowers] = useState([]);

  const [inputs, setInputs] = useState({
    conversationName: "",
    participants: [],
  });

  const user = useRecoilValue(userAtom);
  const [conversations, setConvesations] = useRecoilState(conversationsAtom);

  const { onOpen, onClose, isOpen } = useDisclosure();
  const showToast = useShowToast();

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const res = await fetch(`/api/users/followers/${user._id}`);
        const data = await res.json();

        if (data.error) {
          return showToast("Error", "Could not fetch your followers", "error");
        }

        setFollowers(data);
      } catch (error) {
        showToast("Error", "Could not fetch your followers", "error");
      } finally {
        setLoadingFollowers(false);
      }
    };

    getFollowers();
  }, [showToast, user._id]);

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    if (loadingCreateCon) return;

    if (!inputs.conversationName.length || !inputs.participants.length) {
      setInputs({
        conversationName: "",
        participants: [],
      });

      return showToast(
        "Error",
        "Please select a contact and enter name",
        "error"
      );
    }
    setLoadingCreateCon(true);

    try {
      console.log(inputs);
      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: inputs.participants,
          name: inputs.conversationName,
        }),
      });

      const data = await res.json();

      if (data.error) return showToast("Error", data.error, "error");

      setConvesations([...conversations, data]);
    } catch (error) {
      showToast("Error", "Could not create converation.", "error");
    } finally {
      onClose();
      setLoadingCreateCon(false);
      setInputs({
        conversationName: "",
        participants: [],
      });
    }
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Group name</FormLabel>
              <Input
                disabled={inputs.participants.length < 1}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    conversationName: e.target.value,
                  })
                }
                value={inputs.conversationName}
                placeholder="Enter a cool name!"
              />
            </FormControl>
            <FormControl>
              <CheckboxGroup
                onChange={(e) => setInputs({ ...inputs, participants: e })}
              >
                <VStack
                  display={"flex"}
                  alignItems={"start"}
                  my={4}
                  spacing="24px"
                >
                  {loadingFollowers && !followers && (
                    <Flex>
                      <Spinner />
                    </Flex>
                  )}
                  {!followers.length && (
                    <Flex>
                      <Text size="sm">
                        You have no followers you can chat with.
                      </Text>
                    </Flex>
                  )}
                  {followers.length > 0 &&
                    followers.map((follower) => {
                      return (
                        <Checkbox key={follower._id} value={follower._id}>
                          {follower.name}
                        </Checkbox>
                      );
                    })}
                </VStack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateConversation}
              isLoading={loadingCreateCon}
            >
              Create
            </Button>
            <Button
              disabled={loadingCreateCon}
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button onClick={onOpen} size={"sm"}>
        Create Conversation
      </Button>
    </>
  );
};

export default CreateConversationButton;
