import React, { useEffect, useState } from "react";
import axios from "axios";import ProductCard from "../components/ProductCard";

const Interview = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(2);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/product/pag?page=${page}&limit=${limit}`);
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, [page, limit]);

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => prev + 1);

    return (
        <div>
            <h2>Product List (Page {page})</h2>
            <ul>
                {products.map((prod) => (
                    <li key={prod._id || prod.id}>
                        <strong>{prod.title}</strong> - ${prod.price}
                        <br />
                        {prod.description}
                    </li>


                ))}
            </ul>
            <div style={{ marginTop: "16px" }}>
                <button onClick={handlePrev} disabled={page === 1}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={products.length < limit}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Interview;