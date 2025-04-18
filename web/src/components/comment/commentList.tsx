import { Button, Text, CloseButton, Drawer, Portal, Input, Flex } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { useState } from "react";
import Comment from "./comment";
import { useAuth } from "@/hooks/use-auth";
import useMutationComment from "@/hooks/comments/use-mutation-comments";
import useQueryComments from "@/hooks/comments/use-query-comments";

import { useRating } from "@/hooks/ratings/use-rating";
import { RatingType } from "@/data/types";

const CommentList = ({
  recipe_id,
  user_id
} : {
  recipe_id : number,
  user_id: string
}) => {

    const { user } = useAuth();
    const { updateUserRating } = useRating();
    const [open, setOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { addComment } = useMutationComment(recipe_id);
    const { comments } = useQueryComments(recipe_id);

    const handleCreateComment = async () => {
      if (commentText.trim()) {
        try {
          setCommentText('');
          await addComment(commentText, user.id);
          updateUserRating(user_id, RatingType.COMMENT);
          console.log(comments)
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
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button variant='ghost' color="cyan.400" size="xl">
            <FaComment style={{ width: '40px', height: '40px' }}/>
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
            {/* temporary fix to make comment id unique... */}
            <Flex direction="column">
                {comments && comments.length > 0 ? (
                  comments
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((comment) => (
                      <Comment key={comment.id} comment={comment} user_id={user_id} />
                    ))
                ) : (
                  <Text>No comments yet.</Text>
                )}
            </Flex>
            </Drawer.Body>
            <Drawer.Footer>
              <Input 
                  mt="4" 
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyPress}/>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
    );
};

export default CommentList;
