import React from "react"
import { Icon, MapLeft, View} from "../index.js"

import { withRouter } from "react-router-dom";
import { faRoute } from '@fortawesome/free-solid-svg-icons'

import $ from "jquery"

class AccordionItem extends React.Component{

    constructor(props) {
        super(props)
        this.props = props
        this.ref = React.createRef();
    }

    render()
    {
        return (
            <MapLeft.Parent >
                <MapLeft.Parent.Title onClick={this.props.onToggle}>
                    {this.props.item.name}
                </MapLeft.Parent.Title>
                <MapLeft.Parent.Items ref={this.ref} active={this.props.active ? true : false} Height={
                this.props.active
                  ? this.ref.current.scrollHeight + "px"
                  : "0px"
              }>
                  {this.props.item.items.map((item,i) => (
                      <MapLeft.Item key={i} >
                        <View fullWidth onClick={() => this.props.triggerMap("mark", item.lat, item.lng, item.name)}>
                            <MapLeft.Item.Title>
                                {item.name}
                            </MapLeft.Item.Title>
                            <View fullWidth>
                                <MapLeft.Item.Time>
                                    {item.time}
                                </MapLeft.Item.Time>
                                <MapLeft.Item.Distance>
                                    {item.distance}
                                </MapLeft.Item.Distance>
                            </View>
                        </View>
                        <View onClick={() => this.props.triggerMap("drive", item.lat, item.lng, item.name)} font-size="14px" flex jc-center flex-direction="column" width="100px" className="cursor-pointer">
                            <MapLeft.Item.Route>
                                <Icon icon={faRoute}/>
                            </MapLeft.Item.Route>
                            Yol Tarifi
                        </View>
                    </MapLeft.Item>
                  ))}
                    
                </MapLeft.Parent.Items>
            </MapLeft.Parent>
        )
    }

}

export default AccordionItem