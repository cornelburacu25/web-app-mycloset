import React from "react";
import fashionImage1 from "../assets/fashion-image1.jpg"; // portrait image
import fashionImage2 from "../assets/fashion-image4.jpg"; // portrait image
import fashionImage3 from "../assets/fashion-image2.jpg"; // landscape image
import fashionImage4 from "../assets/fashion-image3.jpg";  // landscape image
import beltImage from "../assets/belt-image.png";
import { faMagnifyingGlass, faStar, faTshirt } from "@fortawesome/free-solid-svg-icons";
import { Container, Header, ImageBox, SideImageBox, Image, CenterText, MainText, SubText, StyledLink, AboutSection,
  AboutHeader, AboutText, AboutContent, Icon, ListItem, List, AboutImage } from "../styles/Home.styled";

const Home = () => {
  return (
    <Container>
      <Header>
        <ImageBox style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
          <Image src={fashionImage3} alt="Fashion Top" />
        </ImageBox>
        <SideImageBox style={{ gridColumn: '1 / 2', gridRow: '1 / 4' }}>
          <Image src={fashionImage1} alt="Fashion Left" />
        </SideImageBox>
        <CenterText>
          <MainText>DISCOVER</MainText>
          <MainText>YOUR</MainText>
          <MainText>STYLE</MainText>
          <SubText>Welcome to MyCloset </SubText>
          <SubText>Your Ultimate Wardrobe Organizer</SubText>
          <StyledLink to="/myclothes">GET STARTED</StyledLink>
        </CenterText>
        <SideImageBox style={{ gridColumn: '3 / 4', gridRow: '1 / 4' }}>
          <Image src={fashionImage2} alt="Fashion Right" />
        </SideImageBox>
        <ImageBox style={{ gridColumn: '2 / 3', gridRow: '3 / 4' }}>
          <Image src={fashionImage4} alt="Fashion Bottom" />
        </ImageBox>
      </Header>
      <AboutSection>
        <AboutHeader>About MyCloset</AboutHeader>
        <AboutText>
        Welcome to MyCloset, your personal fashion assistant! With MyCloset, organizing your clothes has never been easier. 
        Simply use your phone to upload pictures of your wardrobe into the app. Our intuitive interface lets you categorize your clothes, 
        create stunning outfits, and receive daily recommendations tailored to your preferences and the weather.
        </AboutText>
        <AboutText>
        Our advanced machine learning algorithm goes beyond just recognizing clothing categories; it approximates colors 
        to help you keep track of your wardrobe with precision. Imagine having a virtual closet that not only helps you
         organize but also inspires you with new outfit combinations. Embrace a new era of wardrobe management with MyCloset. Keep track of your fashion items, 
         explore new styles, and enjoy the convenience of having your entire 
         closet at your fingertips. Say goodbye to wardrobe confusion and hello to a more organized, stylish you!
        </AboutText>
        <AboutText>
        Getting started is simple. Just snap photos of your clothes, upload them to MyCloset, and start creating outfits in a way that’s 
        far easier and more enjoyable than ever before. Whether you're dressing for work, 
        a night out, or a casual day, MyCloset helps you look your best effortlessly.
        </AboutText>
        <AboutContent>
          <List>
            <ListItem>
              <Icon icon={faTshirt} />
              <span>Organize Your Clothes: Easily categorize and store your wardrobe.</span>
            </ListItem>
            <ListItem>
              <Icon icon={faMagnifyingGlass} />
              <span>Explore Your Style: Discover new outfit combinations and styles.</span>
            </ListItem>
            <ListItem>
              <Icon icon={faStar} />
              <span>Get Daily Recommendations: Receive outfit suggestions based on your preferences.</span>
            </ListItem>
          </List>
          <AboutImage src={beltImage} alt="Belt" />
        </AboutContent>
      </AboutSection>
    </Container>
  );
};

export default Home;
