import { Card, Text, Button, Flex } from "@chakra-ui/react";
import { CommentType, RatingType } from "@/data/types";
import { Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import useMutationComment from "@/hooks/comments/use-mutation-comments";
import { useRating } from "@/hooks/ratings/use-rating";


const Comment = ( { 
  comment,
  user_id 
}: { 
  comment: CommentType,
  user_id: string           // id of the user who's recipe you're commenting on 
}) => {

  const { user } = useAuth();
  const { updateUserRating } = useRating();
  const { removeComment } = useMutationComment(comment.recipeId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      setIsDeleting(true);
      await removeComment(comment.id);
      updateUserRating(user_id, RatingType.UNCOMMENT);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = comment.author.id === user.id;

  return (
      <Card.Root mb="2" borderRadius="md">
          <Card.Body>
              <Flex direction="row" justifyContent="space-between">
                  <Flex direction="column">
                      <Flex direction="column" mb="4">
                          <Text mr="4">{comment.author?.name}</Text>
                          <Text fontSize="xs">{formatTimestamp(comment.createdAt)}</Text>
                      </Flex>
                      <Text fontWeight="bold" fontSize="sm">{comment.content}</Text>
                  </Flex>
                  <Flex>
                      {isAuthor && (
                          <Button 
                              variant="ghost" 
                              size="xs" 
                              mt="2" 
                              color="red.400"
                              onClick={handleDelete}
                              loading={isDeleting}>
                              <Trash />
                          </Button>
                          )
                      }
                  </Flex>
              </Flex>
          </Card.Body>
      </Card.Root>
  );
};

export default Comment;
