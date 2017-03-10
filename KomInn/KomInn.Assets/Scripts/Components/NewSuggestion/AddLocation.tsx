import * as React from "react";
import { Row, Col } from "react-bootstrap";


interface AddLocationProps { onDataUpdate?(location:string):void }
interface AddLocationState { selectedLocation:string }
export class AddLocation extends React.Component<AddLocationProps, AddLocationState>
{
    updateLocation(loc:string)
    {       
        this.props.onDataUpdate(loc); 
    }
    getPosition()
    {        
        var g = navigator.geolocation.getCurrentPosition( (pos:any) => { 
            this.updateLocation(pos); 
        })
    }
    render()
    {
        var geo = navigator.geolocation;         
        return (
<Row>                 
    <Col xs={12}>        
    		<div className="form-area">
                <label htmlFor="sted">Sted (valgfritt)</label>
                <input id="sted" type="text" placeholder="Skriv inn sted" onBlur={ (evt:any) => { console.log(evt); this.updateLocation(evt.target.value)}} />
                { (geo == null) ? "" : 
                <span><span className="separator">eller</span>
                <a href="#" className="btn" onClick={this.getPosition.bind(this)}>Bruk mitt sted</a></span>}
            </div>     
    </Col>
</Row>                    
        )
    }
}