import React from "react";
import { ModalContainer, ModalButton, ModalOverlay } from "../styles/Modal.styled";

const Modal = ({ message, onConfirm, onCancel }) => (
    <ModalOverlay>
      <ModalContainer>
        <p>{message}</p>
        <ModalButton onClick={onConfirm}>Yes</ModalButton>
        <ModalButton onClick={onCancel}>No</ModalButton>
      </ModalContainer>
    </ModalOverlay>
  );
  
  export default Modal;