//src/pages/BlogDetails.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Typography, Button, TextField, Box } from "@mui/material";
import { message } from "antd";
import { useCommentsStore } from "../store/commentsStore";

interface Post {
    id: number;
    title: string;
    body: string;
}


const fetchPost = async (id: number): Promise<Post> => {
    const { data } = await axios.get(`https://dummyjson.com/posts/${id}`);
    return data;
};

const BlogDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [commentText, setCommentText] = useState("");
    const { comments, fetchComments, addComment } = useCommentsStore();


    const { data: post, isLoading: postLoading, isError: postError } = useQuery<Post>({
        queryKey: ["post", id],
        queryFn: () => fetchPost(Number(id)),
        enabled: !!id,
    });

    useEffect(() => {
        if (id) {
            fetchComments(Number(id));
        }
    }, [id, fetchComments]);

    const handleAddComment = async () => {
        if (!id) {
            message.error("Invalid post ID");
            return;
        }
        if (!commentText.trim()) {
            message.error("Comment cannot be empty!");
            return;
        }

        await addComment(Number(id), commentText.trim());
        message.success("Comment added successfully!");
        setCommentText("");
    };

    if (postLoading) return <p>Loading post...</p>;
    if (postError) return <p>Error loading post.</p>;

    return (
        <Box p={3}>
            <Typography variant="h4">{post?.title}</Typography>
            <Typography variant="body1" mt={2}>{post?.body}</Typography>

            <Box mt={4}>
                <Typography variant="h5">Comments</Typography>
                {comments[Number(id)]?.map((comment) => (
                    <Box key={comment.id} p={2} mt={1} border="1px solid lightgray" borderRadius="5px">
                        <Typography variant="body2">{comment.body}</Typography>
                    </Box>
                ))}
            </Box>

            <Box mt={3}>
                <TextField
                    fullWidth
                    label="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    sx={{ mt: 2 }}
                >
                    Add Comment
                </Button>
            </Box>
        </Box>
    );
};

export default BlogDetails;
