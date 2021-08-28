import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StyledTable, THead, TBody, TFoot, TH, TR, TD } from './table'
import { CardContainer, StyledCard, CardHeader, CardBody, CardTitle } from './card'
import { ModalHeader, ModalTitle, ModalTimes, ModalBody } from './modal'
import { color } from "./theme"

//genel
export const Header = styled.div`
    background-color: ${color.primary};
    height:50px;
    display:flex;
    align-items:center;
    padding:0px 20px;
    

    & > a {
      color:#fff;
      font-size:24px;
      font-weight: 600;
      text-decoration:none;
    }
`

export const Button = styled.button`
    background: ${props => props.primary ? color.primary : "#fff"};
    color: ${props => props.primary ? "#fff" : color.primary};
    font-size:1em;
    padding:${props => props.small ? "0.10em 0.5em" : "0.25em 1em"};
    border: 2px solid ${color.primary};
    border-radius: 3px;
    width:${props => props.block ? "100%" : "auto"};

    -webkit-transition: all .1s linear;
    -o-transition: all .1s linear;
    transition: all .1s linear;

    &:hover {
        background: ${props => props.primary ? color.primaryHover : color.primary};
        border: 2px solid ${props => props.primary ? color.primaryHover : color.primary};
        color:#fff
    }
`
export const Label = styled.label`
  display:${props => props.block ? "block" : "inline-block"};
`

export const Input = styled.input`
  padding:8px 10px;
  background: ${color.input};
  border: none;
  border-radius: 5px;

  &:focus {
    outline:0
  }
`

export const View = styled.div`
  width:${props => {
    if (props.fullWidth){
      return "100%"
    }else if (props.width){
      return props.width
    }else
      return "initial"
  }};

  height:${props => {
    if (props.fullHeight){
      return "100%"
    }else if (props.height){
      return props.height
    }else
      return "inherit"
  }};

  position:${props => {
    if (props.position){
      return props.position
    }else
      return "static"
  }};

  display:${props => {
    if (props.flex){
      return "flex"
    }else if (props.display){
      return props.display
    }else
      return "block"
  }};

  justify-content:${props => {
    if (props["jc-center"]){
      return "center"
    }else if (props["jc-flex-start"]){
      return "flex-start"
    }else if (props["jc-flex-end"]){
      return "flex-end"
    }else if (props["jc-space-between"]){
      return "space-between"
    }else
      return "inherit"
  }};

  align-items:${props => {
    if (props["ai-center"]){
      return "center"
    }else if (props["ai-flex-start"]){
      return "flex-start"
    }else if (props["ai-flex-end"]){
      return "flex-end"
    }else
      return "inherit"
  }};

  pointer-events:${props => {
    if (props.dummy){
      return "none"
    }else
      return "all"
  }};

  top:${props => {
    if (props.top){
      return props.top + "px"
    }else
      return "unset"
  }};

  bottom:${props => {
    if (props.bottom){
      return props.bottom + "px"
    }else
      return "unset"
  }};

  left:${props => {
    if (props.left){
      return props.left + "px"
    }else
      return "unset"
  }};

  right:${props => {
    if (props.right){
      return props.right + "px"
    }else
      return "unset"
  }};

  color:${props => {
    if (props.color){
      return props.color
    }else
      return "inherit"
  }};

  flex-direction:${props => {
    if (props["flex-direction"]){
      return props["flex-direction"]
    }else
      return "initial"
  }};

  font-size:${props => {
    if (props["font-size"]){
      return props["font-size"]
    }else
      return "initial"
  }};
` 

export const MapLeft = styled.div`
  width:20%;
  height:calc(100vh - 50px);
  background-color:#fff;
  overflow:auto;

  @media (max-width: 768px) {
    width:100%;
    height:100vh;
  }
`

MapLeft.Item = styled.div`
  width:100%;
  background-color:#F4F4F4;
  padding:5px 20px;
  border-bottom:1px solid #ccc;
  position:relative;
  display:flex;
  align-items:center;
  cursor:pointer;
`

MapLeft.Item.Title = styled.div`
  font-size:18px;
` 
MapLeft.Item.Time = styled.div`
  font-size:16px;
` 

MapLeft.Item.Route = styled.div`
  background-color:${color.primary};
  color:#fff;
  border-radius:100%;
  width:30px;
  height:30px;
  display:flex;
  align-items:center;
  justify-content:center;
` 

MapLeft.Item.Distance = styled.div`
  font-size:16px;
` 

MapLeft.Parent = styled.div`
border-bottom:1px solid #ccc
`

MapLeft.Parent.Title = styled.div`
  font-size:20px;
  padding:20px;
  cursor:pointer;
`

MapLeft.Parent.Items = styled.div`
  overflow: hidden;

  height: ${props => {
    if (props.active){
      return props.Height
    }else
      return "0"
  }};
  transition: height ease 0.2s;
`
export const Map = styled.div`
  width:80%;
  height:calc(100vh - 50px);
  position:relative;
  @media (max-width: 768px) {
    width:100%;
    height:100vh;
  }
`
export const MapLabel = styled.div`
  width:100%;
  padding:0px 20px;
  height:70px;
  align-items:center;
  background:#fff;
  display:flex;
  justify-content:space-between;
  font-size:20px;
  border-bottom:1px solid #ccc
`

export const MapContainer = styled.div`
  display:flex;

  @media (max-width: 768px) {
    flex-direction:column;
  }
`

export const Icon = styled(FontAwesomeIcon)`
  color:${props => {
    if (props.color){
      return props.color
    }else
      return "inherit"
  }};

  font-size:${props => {
    if (props.size){
      return props.size + "px"
    }else
      return "inherit"
  }};
`

//table
export const Table = ({ children, ...rest }) => {
  return <StyledTable {...rest}>{children}</StyledTable>;
}

Table.Head = ({ children, ...rest }) => {
  return <THead {...rest}>{children}</THead>;
}

Table.Body = ({ children, ...rest }) => {
  return <TBody {...rest}>{children}</TBody>;
}

Table.Foot = ({ children, ...rest }) => {
  return <TFoot {...rest}>{children}</TFoot>;
}

Table.TH = ({ children, ...rest }) => {
  return <TH {...rest}>{children}</TH>;
}

Table.TR = ({ children, ...rest }) => {
  return <TR {...rest}>{children}</TR>;
}

Table.TD = ({ children, ...rest }) => {
  return <TD {...rest}>{children}</TD>;
}

//card
export const Card = ({ children, ...rest }) => {
  return <CardContainer {...rest}><StyledCard>{children}</StyledCard></CardContainer>
}

Card.Header = ({ children, ...rest }) => {
  return <CardHeader {...rest}>{children}</CardHeader>
}

Card.Title = ({ children, ...rest }) => {
  return <CardTitle {...rest}>{children}</CardTitle>
}

Card.Body = ({ children, ...rest }) => {
  return <CardBody {...rest}>{children}</CardBody>
}

//modal
export const Modal = {
  Header : ({ children, ...rest }) => {
    return <ModalHeader {...rest}>{children}</ModalHeader>
  },
  Title : ({ children, ...rest }) => {
    return <ModalTitle {...rest}>{children}</ModalTitle>
  },
  Times : ({ children, ...rest }) => {
    return <ModalTimes {...rest}>{children}</ModalTimes>
  },
  Body : ({ children, ...rest }) => {
    return <ModalBody {...rest}>{children}</ModalBody>
  }
}