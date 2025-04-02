import { Card, Text, Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { CommentType } from "@/data/types";
import { Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatTimestamp } from "@/lib/utils";


const Comment = ( { comment }: { comment: CommentType }) => {

  const { user } = useAuth();

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
                            <Button variant="ghost" size="xs" mt="2" color="red.400">
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