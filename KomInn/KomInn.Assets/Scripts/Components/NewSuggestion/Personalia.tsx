import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Person } from "../Common/Person"; 

// TODO: Implement validation
interface PersonaliaProps { onDataUpdate?(person:Person):void,  validationMode?:boolean }

export class Personalia extends React.Component<PersonaliaProps, any>
{
    _person:Person; 
    constructor()
    {
        super();
        this._person = new Person(); 
    }
    update()
    {
        this.props.onDataUpdate(this._person); 
    }
    set(event:any)
    {        
        return event.target.value;
    }
    
    render()
    {
        return (
<Row>                 
    <Col xs={12}>        
            <div className="contacts-form">
            <Row>
                <Col xs={12}>
                    <label htmlFor="Navn">Navn</label>
                    <input id="Navn" type="text"
                       onChange={ (a:any) =>  { this._person.Name =  this.set(a); this.update(); }} value={this._person.Name} />                   
                    <label htmlFor="Adresse">Adresse</label>
                    <input id="Address" type="text"
                        onChange={ (a:any) =>  { this._person.Address =  this.set(a); this.update(); }} value={this._person.Address} />
                    <label htmlFor="Zip">Postnummer</label>
                    <input id="Zip" type="text"
                        onChange={ (a:any) =>  { this._person.Zipcode =  this.set(a); this.update(); }} value={this._person.Zipcode} />						
                    <label htmlFor="Email">E-post</label>
                    <input id="Email" type="text"
                        onChange={ (a:any) =>  { this._person.MailAddress =  this.set(a); this.update(); }} value={this._person.MailAddress} />						
                    <label htmlFor="Telephone">Telefon</label>
                    <input id="Telefon" type="text"
                        onChange={ (a:any) =>  { this._person.Telephone =  this.set(a); this.update(); }} value={this._person.Telephone} />						
                </Col>
            </Row>
            </div>        
    </Col>
</Row>                    
        )
    }
}