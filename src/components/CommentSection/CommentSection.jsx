import React, { useState, useEffect } from "react";
import {
  Box,
  Separator,
  Text,
  Button,
  Textarea,
  VStack,
  Center,
  Spinner,
  HStack,
  Pagination,   // <--- New Import
  ButtonGroup,  // <--- New Import
  IconButton    // <--- New Import
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // <--- Icons
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { CommentCard } from "../CommentCard/CommentCard";

import {
  subscribeToComments,
  postComment,
  removeComment,
  editComment,
  loginUser,
  logoutUser,
} from "../../../data/comments";

const PAGE_SIZE = 5;

export const CommentSection = ({ idMeal }) => {
  const [user, loading, error] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsubscribe = subscribeToComments(idMeal, (data) => {
      setComments(data);
    });
    return () => unsubscribe();
  }, [idMeal]);

  const indexOfLastItem = page * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddComment = async () => {
    if (!inputValue.trim()) return;
    await postComment(inputValue, user, idMeal);
    setInputValue("");
    setPage(1);
  };

  if (loading) {
    return (
      <Box pt="10px">
        <Center><Spinner /></Center>
      </Box>
    );
  }

  if (error) {
    console.error("Auth Error:", error);
  }

  return (
    <Box pt="10px" maxWidth="600px">
      <Separator />
      <Text textStyle="xl" pb="3" fontWeight="bold">
        Comments ({comments.length})
      </Text>

      <Box mb="6" p="4" borderWidth="1px" borderRadius="md">
        {user ? (
          <VStack align="stretch">
            <Text fontSize="sm">
              Posting as: <b>{user.displayName || "User"}</b>
            </Text>
            <Textarea
              placeholder="Add your thoughts about this recipe"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              mb="2"
            />
            <HStack justify="space-between">
              <Button size="sm" variant="outline" onClick={logoutUser}>
                Log Out
              </Button>
              <Button size="sm" onClick={handleAddComment}>
                Post Comment
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack>
            <Text>Log in to leave a comment</Text>
            <Button onClick={loginUser} colorPalette="blue">
              Login with Google
            </Button>
          </VStack>
        )}
      </Box>

      {currentComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          isOwner={user?.uid && comment.uid === user.uid}
          onDelete={removeComment}
          onEdit={editComment}
        />
      ))}
      {comments.length > PAGE_SIZE && (
        <HStack justifyContent="center" mt="6">
          <Pagination.Root
            count={comments.length}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous Page">
                  <HiChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(item) => (
                  <Pagination.Item asChild value={item.value} key={item.value}>
                     <IconButton
                        variant={page === item.value ? "outline" : "ghost"}
                        colorPalette={page === item.value ? "gray.600" : "gray"}
                      >
                        {item.value}
                      </IconButton>
                  </Pagination.Item>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next Page">
                  <HiChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </HStack>
      )}
    </Box>
  );
};