import styled from 'styled-components';

const defaultAnimationValues = {
  duration: 0.2,
  ease: 'ease-in-out',
};

const CollapsibleWrapper = styled.div`
  display: grid;
  grid-template-rows: ${(props) => (props.open ? '1fr' : '0fr')};
  opacity: 0;
  transition: all ${(props) => props.animation.duration}s
    ${(props) => props.animation.ease};
  opacity: ${(props) => (props.open ? 1 : 0)};
`;

const CollapsibleInner = styled.div`
  overflow: hidden;
`;

function Collapsible({ children, animation = defaultAnimationValues, open }) {
  return (
    <CollapsibleWrapper open={open} animation={animation}>
      <CollapsibleInner>{children}</CollapsibleInner>
    </CollapsibleWrapper>
  );
}

export default Collapsible;
