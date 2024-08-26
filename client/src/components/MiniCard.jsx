import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  CCardBody } from '@coreui/react'
import { StyledCard, StyledImage, StyledListGroup, StyledListGroupItem, StyledCardText, StyledCardTitle, StyledButton, StyledButtonWrapper, StyledDeleteButton, LastWornAt } from "../styles/MiniCard.styled";
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
  

export const MiniCard = ({ clothing, onSelect, isSelected }) => {

    const handleCardClick = () => {
        onSelect(clothing);
    };

    return (
        <StyledCard className={`h-100 ${isSelected ? 'selected' : ''}`} onClick={handleCardClick}>
                <StyledImage orientation="top" src={clothing.ClothingImage.url} />
                <CCardBody>
                    <StyledCardTitle>{clothing.title}</StyledCardTitle>
                </CCardBody>
            </StyledCard>
    );
}
