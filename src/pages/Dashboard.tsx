// src/pages/Dashboard.tsx

// src/pages/Dashboard.tsx
// import { useState, useEffect, useMemo } from "react";
// import {
//     TextField,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
//     Card,
//     CardContent,
//     Typography,
//     Button,
//     Grid,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// interface Product {
//     id: number;
//     title: string;
//     category: string;
//     price: number;
//     description: string;
//     images: string[];
// }

// const Dashboard = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [sortState, setSortState] = useState("PRICE_ASC");

//     const { data: products = [], isLoading, isError, error } = useQuery<Product[]>({
//         queryKey: ["products"],
//         queryFn: async () => {
//             const response = await axios.get("https://dummyjson.com/products");
//             return response.data.products;
//         },
//     });

//     const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

//     const filteredProducts = useMemo(() => {
//         return products
//             .filter((product) =>
//                 product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//                 (selectedCategory === "" || product.category === selectedCategory)
//             )
//             .sort((a, b) => {
//                 switch (sortState) {
//                     case "PRICE_ASC": return a.price - b.price;
//                     case "PRICE_DESC": return b.price - a.price;
//                     case "TITLE_ASC": return a.title.localeCompare(b.title);
//                     case "TITLE_DESC": return b.title.localeCompare(a.title);
//                     default: return 0;
//                 }
//             });
//     }, [products, searchQuery, selectedCategory, sortState]);

//     if (isLoading) return <Typography>Loading...</Typography>;
//     if (isError) return <Typography>Error fetching products: {String(error)}</Typography>;

//     return (
//         <div style={{ padding: "20px" }}>
//             <h2>Dashboard</h2>
//             <Grid container spacing={2} style={{ marginBottom: "20px" }}>
//                 <Grid item xs={12} sm={4}>
//                     <TextField
//                         label="Search Products"
//                         variant="outlined"
//                         fullWidth
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <FormControl fullWidth>
//                         <InputLabel>Filter by Category</InputLabel>
//                         <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//                             <MenuItem value="">All</MenuItem>
//                             {categories.map((category) => (
//                                 <MenuItem key={category} value={category}>{category}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <FormControl fullWidth>
//                         <InputLabel>Sort By</InputLabel>
//                         <Select value={sortState} onChange={(e) => setSortState(e.target.value)}>
//                             <MenuItem value="PRICE_ASC">Price: Low to High</MenuItem>
//                             <MenuItem value="PRICE_DESC">Price: High to Low</MenuItem>
//                             <MenuItem value="TITLE_ASC">Title: A-Z</MenuItem>
//                             <MenuItem value="TITLE_DESC">Title: Z-A</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>
//             <Grid container spacing={3}>
//                 {filteredProducts.length > 0 ? (
//                     filteredProducts.map((product) => (
//                         <Grid item xs={12} sm={6} md={4} key={product.id}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6">{product.title}</Typography>
//                                     <Typography variant="body2">Category: {product.category}</Typography>
//                                     <Typography variant="body1">${product.price}</Typography>
//                                     <Link to={`/product/${product.id}`}>
//                                         <Button variant="contained" color="primary">View Details</Button>
//                                     </Link>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))
//                 ) : (
//                     <Typography>No products found</Typography>
//                 )}
//             </Grid>
//         </div>
//     );
// };

// export default Dashboard;