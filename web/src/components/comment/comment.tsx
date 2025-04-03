import { Card, Text, Button, Flex } from "@chakra-ui/react";
import { CommentType } from "@/data/types";
import { Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import useMutationComment from "@/hooks/comments/use-mutation-comments";


const Comment = ( { comment }: { comment: CommentType }) => {

  const { user } = useAuth();
  const { removeComment } = useMutationComment(comment.recipeId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      setIsDeleting(true);
      await removeComment(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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
                        {comment.author?.id == user.id && (
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
