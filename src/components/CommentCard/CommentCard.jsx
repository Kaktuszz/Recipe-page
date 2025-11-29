import { useState } from "react";
import {
  Box,
  Avatar,
  Button,
  Card,
  HStack,
  Stack,
  Text,
  Textarea,
  Popover,
} from "@chakra-ui/react";

export const CommentCard = ({ comment, isOwner, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleSave = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <Box>
      <Card.Root width="100%" mb="10px">
        <Card.Body pb="10px">
          <HStack mb="1" gap="3">
            <Avatar.Root>
              <Avatar.Image src={comment.photoURL} />
              <Avatar.Fallback name={comment.displayName} />
            </Avatar.Root>
            <Stack gap="0">
              <Text fontWeight="semibold" textStyle="sm">
                {comment.displayName}
              </Text>
              <Text textStyle="xs" color="gray.500">
                {formatDate(comment.createdAt)}
              </Text>
            </Stack>
          </HStack>

          {isEditing ? (
            <Box mt="2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                size="sm"
                mb="2"
              />
              <HStack>
                <Button size="xs" colorPalette="blue" onClick={handleSave}>
                  Save
                </Button>
                <Button size="xs" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </HStack>
            </Box>
          ) : (
            <Card.Description mt="2">{comment.text}</Card.Description>
          )}
        </Card.Body>

        {isOwner ? (
          !isEditing && (
            <Card.Footer justifyContent="flex-end" pt="0" pb="10px">
              <HStack gap="2">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>

                <Popover.Root>
                  <Popover.Trigger asChild>
                    <Button size="xs" colorPalette="red" variant="ghost">
                      Delete
                    </Button>
                  </Popover.Trigger>
                  
                  <Popover.Positioner>
                    <Popover.Content>
                      <Popover.Arrow />
                      <Popover.Body fontSize="sm">
                        Are you sure you want to delete this comment?
                      </Popover.Body>
                      <Popover.Footer justifyContent="flex-end">
                        <Popover.CloseTrigger asChild>
                          <Button size="xs" variant="outline">
                            Cancel
                          </Button>
                        </Popover.CloseTrigger>
                        <Button
                          size="xs"
                          colorPalette="red"
                          onClick={() => onDelete(comment.id)}
                        >
                          Confirm
                        </Button>
                      </Popover.Footer>
                    </Popover.Content>
                  </Popover.Positioner>
                  
                </Popover.Root>
              </HStack>
            </Card.Footer>
          )
        ) : (
          <Card.Footer pt="0" pb="10px"></Card.Footer>
        )}
      </Card.Root>
    </Box>
  );
};