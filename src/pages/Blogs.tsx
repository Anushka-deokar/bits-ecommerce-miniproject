//src>pages>Blogs.tsx
// src/pages/Blogs.tsx

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Button, Grid, Container } from "@mui/material";

// Define Post Type
interface Post {
    id: number;
    title: string;
    body: string;
}

// Fetch posts from API
const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await axios.get("https://dummyjson.com/posts");
    return data.posts;
};

const Blogs = () => {
    const navigate = useNavigate();

    // Fetch posts using React Query
    const { data: posts = [], isLoading, isError } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
        staleTime: 5 * 60 * 1000, // Cache posts for 5 minutes
    });

    if (isLoading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />;
    if (isError) return <Typography color="error" align="center">Failed to load posts.</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Blog Posts
            </Typography>

            <Grid container spacing={3}>
                {posts.map(({ id, title, body }) => (
                    <Grid item xs={12} sm={6} md={4} key={id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {body.slice(0, 100)}...
                                </Typography>
                            </CardContent>
                            <Button
                                variant="contained"
                                sx={{ m: 2 }}
                                onClick={() => navigate(`/dashboard/blogs/${id}`)}
                            >
                                Read More
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Blogs;
