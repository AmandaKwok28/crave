import { Button, Text, CloseButton, Drawer, Portal, Input, Flex } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CommentType } from "@/data/types";
import Comment from "./comment";
import { createComment, fetchComments } from "@/data/api";

const CommentList = ({recipe_id} : {recipe_id : number}) => {
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState<CommentType[] | null>();
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchComments(recipe_id)
          .then((rec) => setComments(rec))
          .catch(console.error);
    }, [recipe_id]);

    const handleCreateComment = async () => {
      if (commentText.trim()) {
        try {
          await createComment(recipe_id, commentText);
          setCommentText('');
        } catch (error) {
          console.error('Error creating comment:', error);
        }
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateComment();
      }
    };

    return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
      <Drawer.Trigger asChild>
        <Button variant='ghost' color="cyan.400">
            <FaComment />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Flex direction="row" justifyContent="space-between">
                <Drawer.Title>Comments</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" justifyContent="space-between" height="full"> 
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <Text>No comments yet.</Text>
              )}
              <Input 
                mt="4" 
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyPress}/>
            </Drawer.Body>
            <Drawer.Footer>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
    );
};

export default CommentList;
