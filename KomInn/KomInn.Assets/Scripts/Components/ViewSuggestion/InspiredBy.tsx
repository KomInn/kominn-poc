import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";
import { DataAdapter } from "../Common/DataAdapter";
interface InspiredByProps { suggestion:Suggestion }
interface InspiredByState { InspiredBy:Array<Suggestion>, InspirationFor:Array<Suggestion>   }
export class InspiredBy extends React.Component<InspiredByProps, InspiredByState>
{
    constructor()
    {
        super(); 
        this.state ={ InspiredBy:new Array<Suggestion>(), InspirationFor:new Array<Suggestion>() }; 
        
    }

    componentWillMount()
    {
        this.setState({InspiredBy:this.props.suggestion.InspiredBy})
        var da = new DataAdapter();         

    }

    render()
    {
        return (
            <Row>                
                <div className="text-area">
                    <h3>Forbindelse til andre forslag</h3>
                    <p>Visualiseringen nedefor viser hvordan dette forslaget både har blitt inspirert av andre, tidligere, forslag samtidig som det igjen har inspirert ny forslag.</p>
                </div>
                <div className="img-area hidden-xs">
                    <img src="images/img-7.png" width="531" height="299" alt="image description"/>
                </div>
                <div className="btn-holder hidden-xs">
                    <a href="#" className="btn-link">Tidligere forslag</a>
                    <a href="#" className="btn-link">Senere forslag</a>
                </div>
            </Row>                    
        )
    }
}