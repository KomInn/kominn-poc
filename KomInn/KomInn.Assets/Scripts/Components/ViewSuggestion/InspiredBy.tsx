import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class InspiredBy extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <div id="wrapper">
                    <div class="text-area">
                        <h3>Forbindelse til andre forslag</h3>
                        <p>Visualiseringen nedefor viser hvordan dette forslaget både har blitt inspirert av andre, tidligere, forslag samtidig som det igjen har inspirert ny forslag.</p>
                    </div>
                    <div class="img-area hidden-xs">
                        <img src="images/img-7.png" width="531" height="299" alt="image description">
                    </div>
                    <div class="btn-holder hidden-xs">
                        <a href="#" class="btn-link">Tidligere forslag</a>
                        <a href="#" class="btn-link">Senere forslag</a>
                    </div>
                </div>                 
            </Row>                    
        )
    }
}