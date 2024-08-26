import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CCardBody } from '@coreui/react';
import { StyledCard, StyledImage, StyledListGroup, StyledListGroupItem, StyledCardText, StyledCardTitle, StyledButton, StyledButtonWrapper, StyledDeleteButton, LastWornAt } from "../styles/OutfitCard.styled";
import { Popconfirm } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReactCardFlip from "react-card-flip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const [year, month, day] = isoString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

export const OutfitCard = ({ outfit }) => {
    const [flip, setFlip] = useState(false); // State for managing flip
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for managing delete modal
    const [isFavorite, setIsFavorite] = useState(outfit.isFavorite);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFavorite(outfit.isFavorite);
    }, [outfit.isFavorite]);

    const handleDeleteConfirm = () => {
        try {
            // Make a DELETE request to your backend API endpoint
            axios.delete(`http://localhost:9000/mycloset/outfits/${outfit.id}`);
            
            // If the deletion is successful, display a success message
            toast.success('You have successfully deleted an outfit!', {
                onClose: () => navigate(0)
            });
            
        } catch (error) {
            console.error("Failed to delete outfit:", error);
            // If there's an error during deletion, display an error message
            toast.error('Failed to delete the outfit');
        }
        setDeleteModalOpen(false); // Close the delete modal
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false); // Close the delete modal
    };

    const handleCardClick = (e) => {
        const isButtonClick = e.target.closest('button'); // Check if the click occurred on a button or its children
        if (!deleteModalOpen && !isButtonClick) {
            setFlip(!flip); 
        }
    };

    const toggleFavorite = async () => {
        try {
            const response = await axios.patch(`http://localhost:9000/mycloset/outfits/${outfit.id}/favorite`, { isFavorite: !isFavorite });
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error("Failed to update favorite status:", error);
            toast.error('Failed to update favorite status');
        }
    };
    

    return (
        <ReactCardFlip isFlipped={flip} flipDirection="vertical">
            <StyledCard className="h-100" key="front" onClick={handleCardClick}>
            <div style={{ position: 'relative' }}>
                    <StyledImage orientation="top" src={outfit.OutfitImage.url} />
                    <FontAwesomeIcon
                        icon={isFavorite ? solidStar : regularStar}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent event propagation to parent elements
                            toggleFavorite();
                        }}
                        style={{ position: 'absolute', top: '10px', right: '10px', color: isFavorite ? 'gold' : 'gray', cursor: 'pointer', zIndex: 1 }}
                    />
                </div>
                <CCardBody>
                    <StyledCardTitle>{outfit.name}</StyledCardTitle>
                    <StyledCardText> {outfit.description}</StyledCardText>
                    <LastWornAt>Last Worn: {formatDate(outfit.lastWornAt)}</LastWornAt>
                </CCardBody>
            </StyledCard>
            <StyledCard className="h-100" key="back" onClick={handleCardClick} style={{ fontSize: 'x-large', textAlignLast: 'center', alignContent: 'center' }}>
                <StyledListGroup>
                    <StyledListGroupItem> Ocassion: {outfit.ocassionType} </StyledListGroupItem>
                    <StyledListGroupItem> Number of Wears: {outfit.numberOfWears} </StyledListGroupItem>
                </StyledListGroup>
                <StyledButtonWrapper>
                    <StyledButton color="primary" as={Link} to={`/edit-outfit/${outfit.id}`}>Edit</StyledButton>
                    <Popconfirm
                        title="Delete the outfit"
                        description="Are you sure to delete this outfit?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <StyledDeleteButton danger>Delete</StyledDeleteButton>
                    </Popconfirm>
                </StyledButtonWrapper>
            </StyledCard>
        </ReactCardFlip>
    );
}
