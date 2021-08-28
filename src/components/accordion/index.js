import React from "react"
import { MapLeft, View} from "../index.js"

import { withRouter } from "react-router-dom";

import $ from "jquery"

import Item from "./accordionItem"

class Accordion extends React.Component{

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            clicked:false
        }
    }

    async handleToggle(index, item) {

        await this.props.open(item, this.state.clicked === index)

        if(this.state.clicked === index) {
            return this.setState({clicked:false})
        }
        return this.setState({clicked:index})
    }

    render()
    {
        return (
            <>
                {Object.values(this.props.items).map((a,i) => (
                    <Item
                        key={i}
                        onToggle={() => this.handleToggle(i, Object.keys(this.props.items)[i])}
                        active={this.state.clicked === i}
                        item={a}
                        triggerMap={this.props.triggerMap}
                    />
                ))}

            </>
        )
    }

}

export default Accordion