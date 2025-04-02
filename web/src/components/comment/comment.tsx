import { Card, Text, Box } from "@chakra-ui/react";
import { CommentType } from "@/data/types";

const Comment = ( { comment }: { comment: CommentType }) => {

    return (
        <Card.Root mb="2" borderRadius="md">
            <Card.Body>
                <Box display="flex" alignItems="center" gap="2" mb="2">
                    <Text>{comment.author.name}</Text>
                    <Text></Text>
                </Box>
                <Card.Title>
                    <Text fontSize="sm">{comment.content}</Text>
                </Card.Title>
            </Card.Body>
        </Card.Root>
    );
};

export default Comment;