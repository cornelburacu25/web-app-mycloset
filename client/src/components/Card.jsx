import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CCardBody } from '@coreui/react';
import { StyledCard, StyledImage, StyledListGroup, StyledListGroupItem, StyledCardText, StyledCardTitle, StyledButton, StyledButtonWrapper, StyledDeleteButton, LastWornAt } from "../styles/Card.styled";
import { Popconfirm } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReactCardFlip from "react-card-flip";


function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

function toUpperCase(str) {
    if(str != null){
    return str.toUpperCase();
    }
}

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const [year, month, day] = isoString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

export const Card = ({ clothing }) => {
    const [flip, setFlip] = useState(false); // State for managing flip
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for managing delete modal
    const navigate = useNavigate();

    const handleDeleteConfirm = () => {
        try {
            // Make a DELETE request to your backend API endpoint
            axios.delete(`http://localhost:9000/mycloset/clothings/${clothing.id}`);
            
            // If the deletion is successful, display a success message
            toast.success('You have successfully deleted a clothing!', {
                onClose: () => navigate(0)
            });
            
        } catch (error) {
            console.error("Failed to delete clothing:", error);
            // If there's an error during deletion, display an error message
            toast.error('Failed to delete the clothing');
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

    return (
        <ReactCardFlip isFlipped={flip} flipDirection="vertical">
            <StyledCard className="h-100" key="front" onClick={handleCardClick}>
                <StyledImage orientation="top" src={clothing.ClothingImage.url} />
                <CCardBody>
                    <StyledCardTitle>{clothing.title}</StyledCardTitle>
                    <StyledCardText> {clothing.description}</StyledCardText>
                    <LastWornAt>Last Worn: {formatDate(clothing.lastWornAt)} </LastWornAt>
                </CCardBody>
            </StyledCard>
            <StyledCard className="h-100" key="back" onClick={handleCardClick} style={{ fontSize: 'x-large', textAlignLast: 'center', alignContent: 'center' }}>
                <StyledListGroup>
                    <StyledListGroupItem> Category: {clothing.category} </StyledListGroupItem>
                    <StyledListGroupItem> Color: {clothing.color} </StyledListGroupItem>
                    <StyledListGroupItem> Material: {clothing.material} </StyledListGroupItem>
                    <StyledListGroupItem> Price: {clothing.price || 'N/A'} </StyledListGroupItem>
                    <StyledListGroupItem> Size: {toUpperCase(clothing.size) || 'N/A' } </StyledListGroupItem>
                    <StyledListGroupItem> Brand: {capitalizeEachWord(clothing.Brand.name)} </StyledListGroupItem>
                    <StyledListGroupItem> Number of Wears: {clothing.numberOfWears} </StyledListGroupItem>
                </StyledListGroup>
                <StyledButtonWrapper>
                    <StyledButton color="primary" as={Link} to={`/edit-clothing/${clothing.id}`}>Edit</StyledButton>
                    <Popconfirm
                        title="Delete the clothing"
                        description="Are you sure to delete this clothing?"
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
