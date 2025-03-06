import { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress, Button, ButtonGroup, Fade, TextField
} from "@mui/material";
import axios from "axios";


interface Quote {
    id: number;
    quote: string;
    author: string;
}

interface Recipe {
    id: number;
    name: string;
    ingredients: string[];
}

const QuotesRecipes = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<"quotes" | "recipes">("quotes");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quotesRes, recipesRes] = await Promise.all([
                    axios.get<{ quotes: Quote[] }>("https://dummyjson.com/quotes"),
                    axios.get<{ recipes: Recipe[] }>("https://dummyjson.com/recipes")
                ]);

                setQuotes(quotesRes.data.quotes);
                setRecipes(recipesRes.data.recipes);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }


    const filteredQuotes = quotes.filter((q: Quote) =>
        q.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredRecipes = recipes.filter((r: Recipe) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box p={3}>
            {/* Category Filter Buttons */}
            <Box display="flex" justifyContent="center" mb={3}>
                <ButtonGroup variant="contained">
                    <Button
                        color={selectedCategory === "quotes" ? "primary" : "inherit"}
                        onClick={() => { setSelectedCategory("quotes"); setSearchQuery(""); }}
                    >
                        🌟 Motivational Quotes
                    </Button>
                    <Button
                        color={selectedCategory === "recipes" ? "secondary" : "inherit"}
                        onClick={() => { setSelectedCategory("recipes"); setSearchQuery(""); }}
                    >
                        🍽️ Recipes
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Search Bar */}
            <Box display="flex" justifyContent="center" mb={3}>
                <TextField
                    label={selectedCategory === "quotes" ? "Search by Author" : "Search by Recipe Name"}
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            {/* Motivational Quotes Section */}
            <Fade in={selectedCategory === "quotes"} timeout={500}>
                <Box display={selectedCategory === "quotes" ? "block" : "none"}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                        🌟 Motivational Quotes
                    </Typography>
                    <Grid container spacing={3}>
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((quote) => (
                                <Grid item xs={12} sm={6} md={4} key={quote.id}>
                                    <Card sx={{ borderLeft: "5px solid #1976d2", boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="body1" fontStyle="italic">
                                                “{quote.quote}”
                                            </Typography>
                                            <Typography variant="subtitle2" align="right" mt={1} color="text.secondary">
                                                — {quote.author}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography color="text.secondary" align="center">
                                No quotes found for "{searchQuery}"
                            </Typography>
                        )}
                    </Grid>
                </Box>
            </Fade>

            {/* Recipes Section */}
            <Fade in={selectedCategory === "recipes"} timeout={500}>
                <Box display={selectedCategory === "recipes" ? "block" : "none"}>
                    <Typography variant="h4" gutterBottom mt={4} fontWeight="bold" color="secondary">
                        🍽️ Delicious Recipes
                    </Typography>
                    <Grid container spacing={3}>
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((recipe) => (
                                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                                    <Card sx={{ borderLeft: "5px solid #ff9800", boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold">{recipe.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {recipe.ingredients.join(", ")}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography color="text.secondary" align="center">
                                No recipes found for "{searchQuery}"
                            </Typography>
                        )}
                    </Grid>
                </Box>
            </Fade>
        </Box>
    );
};

export default QuotesRecipes;
