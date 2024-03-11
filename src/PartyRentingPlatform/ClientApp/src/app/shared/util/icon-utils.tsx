import { Star, StarBorder } from "@mui/icons-material";
import React from "react"

export const generateStarIcons: React.FC = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= rating ? <Star key={i} className="star-icon" /> : <StarBorder key={i} className="star-icon" />);
    }
    return stars;
};