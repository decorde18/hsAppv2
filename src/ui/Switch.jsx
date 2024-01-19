import styled, { css } from 'styled-components';
import React from 'react';
// import './Switch.css';

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin: auto;
`;
const Button = styled.div`
  position: relative;
  width: 40px; // these are the changes to make to make it bigger/smaller
  height: 20px; // these are the changes to make to make it bigger/smaller
  background: var(--color-grey-200);
  border-radius: 32px;
  padding: 4px;
  transition: 300ms all;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

  &:before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 15px; // these are the changes to make to make it bigger/smaller
    height: 15px; // these are the changes to make to make it bigger/smaller
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: white;
    transform: translate(0, -50%);
  }
`;

const Input = styled.input`
  opacity: 0;
  position: absolute;

  &:checked + ${Button} {
    color: var(--color-brand-50);
    border: 1px solid var(--color-brand-500);
    background-color: var(--color-brand-500);

    &:before {
      transform: translate(17px, -50%);
    }
  }
`;

export default function Switch({ checked, onChange, name, disabled }) {
  return (
    <Label>
      <Input
        checked={checked}
        type="checkbox"
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      <Button />
    </Label>
  );
}
