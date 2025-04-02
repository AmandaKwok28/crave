import { Button, Text, CloseButton, Drawer, Portal, Card } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { useState } from "react";
import { AuthorType, CommentType } from "@/data/types";
import Comment from "./comment";

// export const fakeAuthors: AuthorType[] = [
//   {
//     id: "author1",
//     email: "author1@example.com",
//     name: "John Doe",
//     school: "Harvard University",
//     major: "Computer Science",
//   },
//   {
//     id: "author2",
//     email: "author2@example.com",
//     name: "Jane Smith",
//     school: "Stanford University",
//     major: "Electrical Engineering",
//   },
//   {
//     id: "author3",
//     email: "author3@example.com",
//     name: "Alice Johnson",
//     school: "Massachusetts Institute of Technology",
//     major: "Mechanical Engineering",
//   },
// ];

// const fakeComments: CommentType[] = [
//   { id: "1", recipeId: "101", author: fakeAuthors[0], content: "Great post." },
//   { id: "2", recipeId: "101", author: fakeAuthors[1], content: "Thanks for sharing this." },
//   { id: "3", recipeId: "101", author: fakeAuthors[2], content: "I found this really helpful!" }
// ];


const CommentList = ({comments} : {comments : CommentType[]}) => {
    const [open, setOpen] = useState(false);

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
              <Drawer.Title>Comments</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <Text>No comments yet.</Text>
              )}
            </Drawer.Body>
            <Drawer.Footer>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
    );
};

export default CommentList;
