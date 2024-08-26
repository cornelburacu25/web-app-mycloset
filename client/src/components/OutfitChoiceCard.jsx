import React from "react";
import { StyledCard, StyledImage, StyledButtonWrapper, LikeButton, DislikeButton, StyledCardTitle } from "../styles/OutfitChoiceCard.styled";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

export const OutfitChoiceCard = ({ outfit, onLike, onDislike }) => {
    return (
        <StyledCard className="h-100">
            <StyledImage orientation="top" src={outfit.OutfitImage.url} />
            <StyledCardTitle>{outfit.name}</StyledCardTitle>
            <StyledButtonWrapper>
                <LikeButton color="success" onClick={onLike}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                </LikeButton>
                <DislikeButton color="danger" onClick={onDislike}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                </DislikeButton>
            </StyledButtonWrapper>
        </StyledCard>
    );
};

