import PropTypes from "prop-types";
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// eslint-disable-next-line react/prop-types
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} name={reply.userName} />
        <Flex flexDir={"column"} gap={1} w={"540px"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.userName}
            </Text>
          </Flex>

          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

Comment.propTypes = {
  reply: PropTypes.shape({
    userProfilePic: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
