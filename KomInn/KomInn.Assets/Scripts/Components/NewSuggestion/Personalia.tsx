import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Person } from "../Common/Person"; 
import { DataAdapter }from "../Common/DataAdapter"; 

// TODO: Implement validation
interface PersonaliaProps { onDataUpdate?(person:Person):void,  validationMode?:boolean }
interface PersonaliaState { profile:Person }
enum Fields { Name, Address, Zipcode, MailAddress, Telephone  };
export class Personalia extends React.Component<PersonaliaProps, PersonaliaState>
{  
    constructor()
    {
        super();
        this.state = { profile:new Person() };
        var da = new DataAdapter(); 
        da.getMyUserProfile().then( (result:Person) => {    
            console.log(result);         
            this.setState({profile:result}); 
        })
        
    }
    update()
    {
        this.props.onDataUpdate(this.state.profile); 
    }
    set(event:any)
    {        
        return event.target.value;
    }
    

    updateField(evt:any, field:Fields)
    {
        var val = evt.target.value; 
        var s = this.state.profile; 
        switch(field)
        {
            case Fields.Address: s.Address = val; break; 
            case Fields.MailAddress:  s.MailAddress = val; break; 
            case Fields.Name: s.Name = val; break; 
            case Fields.Telephone: s.Telephone = val; break; 
            case Fields.Zipcode: s.Zipcode = val; break; 
        }        
        this.setState({profile:s}, () => { this.update() }); 
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
                       onChange={ (a:any) =>  { this.updateField(a, Fields.Name) }} value={this.state.profile.Name} />                   
                    <label htmlFor="Adresse">Adresse</label>
                    <input id="Address" type="text"
                        onChange={ (a:any) =>  {this.updateField(a, Fields.Address) }} value={this.state.profile.Address} />
                    <label htmlFor="Zip">Postnummer</label>
                    <input id="Zip" type="text"
                        onChange={ (a:any) =>  { this.updateField(a, Fields.Zipcode)}} value={this.state.profile.Zipcode} />						
                    <label htmlFor="Email">E-post</label>
                    <input id="Email" type="text"
                        onChange={ (a:any) =>  { this.updateField(a, Fields.MailAddress) }} value={this.state.profile.MailAddress} />						
                    <label htmlFor="Telephone">Telefon</label>
                    <input id="Telefon" type="text"
                        onChange={ (a:any) =>  { this.updateField(a, Fields.Telephone) }} value={this.state.profile.Telephone} />						
                </Col>
            </Row>
            </div>        
    </Col>
</Row>                    
        )
    }
}