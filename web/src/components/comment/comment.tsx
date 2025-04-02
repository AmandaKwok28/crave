import { Card, Text, Box, Button, Flex } from "@chakra-ui/react";
import { CommentType } from "@/data/types";
import { Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";


const Comment = ( { comment }: { comment: CommentType }) => {

  const { user } = useAuth();

    return (
        <Card.Root mb="2" borderRadius="md">
            <Card.Body>
                <Flex direction="row" justifyContent="space-between">
                    <Flex direction="column">
                        <Box display="flex" alignItems="center" gap="2" mb="1">
                            <Text>{comment.author?.name}</Text>
                        </Box>
                        <Card.Title>
                            <Text fontSize="sm">{comment.content}</Text>
                        </Card.Title>
                    </Flex>
                    {comment.author?.id == user.id && (
                        <Button variant="ghost" size="xs" mt="2" color="red.400">
                            <Trash />
                        </Button>
                        )
                    }
                </Flex>
            </Card.Body>
        </Card.Root>
    );
};

export default Comment;