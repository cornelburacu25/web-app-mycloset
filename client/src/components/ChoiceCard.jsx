import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  CCardBody } from '@coreui/react'
import { ChoiceCardWrapper, CardTitle, CardButton } from "../styles/ChoiceCard.styled";
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
  

  const ChoiceCard = ({ title, link }) => (
    <ChoiceCardWrapper>
      <CardTitle>{title}</CardTitle>
      <CardButton to={link}>Go</CardButton>
    </ChoiceCardWrapper>
  );

  export default ChoiceCard;