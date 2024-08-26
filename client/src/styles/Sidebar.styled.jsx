import styled from 'styled-components';

export const SidebarContainer = styled.div`
    padding: 20px;
    width: 300px;
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
`;

export const Section = styled.div`
    margin-bottom: 20px;
`;

export const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
`;

export const RadioGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const RadioLabel = styled.label`
    display: flex;
    align-items: center;
`;

export const RadioInput = styled.input`
    margin-right: 5px;
`;

export const Accordion = styled.div`
    overflow: hidden;
    transition: max-height 0.6s ease-out;
`;

export const AccordionButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 10px;
    font-size: 18px;
    transition: background 0.3s ease;
    &:hover {
        background: #ddd;
    }
`;

export const AccordionContent = styled.div`
    max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
    overflow: hidden;
    transition: max-height 0.6s ease-out, opacity 0.6s ease-out;
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

export const CheckboxGroup = styled.div`
    margin-bottom: 10px;
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

export const CheckboxInput = styled.input`
    margin-right: 5px;
`;

export const SelectGroup = styled.div`
    margin-bottom: 10px;
`;

export const SelectLabel = styled.label`
    display: block;
    margin-bottom: 5px;
`;

export const SelectInput = styled.select`
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
`;

export const GenerateButton = styled.button`
    width: 100%;
    padding: 10px;
    background: black;
    color: white;
    border-radius: 15px;
    transition: 0.2s;
    cursor: pointer;
`;

export const Separator = styled.hr`
    border: 0;
    height: 1px;
    background: #ccc;
    margin: 20px 0;
`;
