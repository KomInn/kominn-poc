import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";

interface ContentProps { suggestion?:Suggestion }
export class Content extends React.Component<ContentProps, any>
{
    render()
    {
        return (
            <Row>                
                <h2>{this.props.suggestion.Title}</h2>
                <div className="item-holder">
                    <div className="img-frame">
                        <img src={this.props.suggestion.Image} width="531" height="299" alt="" />
                    </div>
                </div>  
            </Row>                    
        )
    }
}
