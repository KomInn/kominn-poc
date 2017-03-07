import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Location } from "../Common/Location"; 

interface AddLocationProps { onDataUpdate?(location:Location):void }
interface AddLocationState { selectedLocation:Location }
export class AddLocation extends React.Component<AddLocationProps, AddLocationState>
{
    render()
    {
        return (
<Row>                 
    <Col xs={12}>        
    		<div className="form-area">
                <label htmlFor="sted">Sted (valgfritt)</label>
                <input id="sted" type="text" placeholder="Skriv inn sted" />
                <span className="separator">eller</span>
                <a href="#" className="btn">Bruk mitt sted</a>
            </div>     
    </Col>
</Row>                    
        )
    }
}