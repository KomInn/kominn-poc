import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";

interface SummaryProps { suggestion:Suggestion }
export class Summary extends React.Component<SummaryProps, any>
{
    render()
    {
        return (
            <Row>
                <Col xs={12}>                
                    <div className="text-area">
                        <h3>Sammendrag</h3>
                        <p>{this.props.suggestion.Summary}</p>
                    </div>
                    <div className="text-area">
                        <h3>Utfordringer</h3>
                        <p>{this.props.suggestion.Challenges}</p>
                    </div>
                    <div className="text-area">
                        <h3>Løsningsforslag</h3>
                        <p>{this.props.suggestion.SuggestedSolution}</p>
                    </div>                   
                </Col>
            </Row>                    
        )
    }
}