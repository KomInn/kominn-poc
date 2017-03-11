import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";
import { Tools } from "../Common/Tools";
interface MapProps { suggestion:Suggestion }
export class Map extends React.Component<MapProps, any>
{   
    render()
    {
        return (
            <Row>                
                <div className="sub-box">
                    <time>{Tools.FormatDate(this.props.suggestion.Created)}</time>
                    <strong className="author">{this.props.suggestion.Submitter.Name}</strong>
                    <address>
                            {this.props.suggestion.Submitter.Address}<br/>
                            {this.props.suggestion.Submitter.Zipcode}, {this.props.suggestion.Submitter.City}
                    </address>
                    <span className="type-frame">Nyttetype: {this.props.suggestion.UsefulnessType}</span>
                </div>
                <div className="map-block hidden-xs">
                    
                </div>
            </Row>                    
        )
    }
}