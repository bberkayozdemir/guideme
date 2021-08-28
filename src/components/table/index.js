import styled from 'styled-components'
import { color } from "../theme"

export const StyledTable = styled.table`
    width:100%;
`

export const THead = styled.thead`

`

export const TFoot = styled.tfoot`

`

export const TBody = styled.tbody`

`

export const TR = styled.tr`
    
`

export const TH = styled.th`
    text-align: ${props => {
        if (props.align === 'center') {
            return "center"
        }else if (props.align === 'right') {
            return "right"
        }else if (props.align === 'left') {
            return "left"
        }else{
            return "inherit"
        }
    }};
    font-weight:normal
`

export const TD = styled.td`
    text-align: ${props => {
        if (props.align === 'center') {
            return "center"
        }else if (props.align === 'right') {
            return "right"
        }else if (props.align === 'left') {
            return "left"
        }else{
            return "inherit"
        }
    }};
    padding:10px 0px;
    border-top:1px solid ${color.grey}
`