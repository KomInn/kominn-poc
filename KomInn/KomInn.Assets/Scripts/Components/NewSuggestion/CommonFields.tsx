import * as React from "react";
import { Row, Col, FormGroup, FormControl, HelpBlock, ControlLabel } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
import { ErrorLabel }from "../Common/CustomLabels"
/* TODO: Implement validation */ 
interface CommonFieldsProps { onSuggestionUpdate?(suggestion:Suggestion):void, validationMode:boolean }

export class CommonFields extends React.Component<CommonFieldsProps, any>
{
    _type:Array<string>;
    _suggestion:Suggestion; 
    constructor()
    {
        super();        
        this._suggestion = new Suggestion(); 
        this._type = new Array<string>(); 
        // TODO: Get options from taxonomy (or list)
        this._type.push("Tidstyvjakt / Effektivisering");
        this._type.push("Bedre kvalitet på tjenesten / Tjenesteinnovasjon");
        this._type.push("Samskaping / Gjøre noe sammen med andre enn kommunale aktører");
        this._type.push("Annet");
        this._suggestion.UsefulnessType = this._type[0];
    }
    set(event:any)
    {        
        return event.target.value;
    }
    update() {       
        this.props.onSuggestionUpdate(this._suggestion); 
    }

    render()
    {
        var showValidationMessages = false;        
        return (
            <Row>                            
                <Col xs={12}>              
                <div className="form-section">
                <h2>Nytt forslag</h2>
                    <div >
					<Row>    
                        <Col xs={12}>                  
                        <FormGroup validationState={ ((this.props.validationMode && (this._suggestion.Title == null || this._suggestion.Title.length <= 0) ? "error" : null)) }>
						<ControlLabel>Tittel *</ControlLabel>
						<FormControl type="text" onChange={ (a:any) =>  { this._suggestion.Title =  this.set(a); this.update(); }} value={this._suggestion.Title} />
                             <FormControl.Feedback />                           
                        </FormGroup>
                        
                        <FormGroup validationState={ ((this.props.validationMode && (this._suggestion.Summary == null || this._suggestion.Summary.length <= 0) ? "error" : null)) }>
						<ControlLabel>Sammendrag *</ControlLabel>
						<FormControl componentClass="textarea"  onChange={ (a:any) =>  { this._suggestion.Summary =  this.set(a); this.update(); }} value={this._suggestion.Summary} />
                             <FormControl.Feedback />                              
                        </FormGroup>											
                       
                          <FormGroup validationState={ ((this.props.validationMode && (this._suggestion.Challenges == null || this._suggestion.Challenges.length <= 0) ? "error" : null)) }>
						<ControlLabel>Utfordring *</ControlLabel>
						<FormControl componentClass="textarea"  onChange={ (a:any) =>  { this._suggestion.Challenges =  this.set(a); this.update(); }} value={this._suggestion.Challenges} />
                             <FormControl.Feedback />                              
                        </FormGroup>	

                        
                          <FormGroup validationState={ ((this.props.validationMode && (this._suggestion.SuggestedSolution == null || this._suggestion.SuggestedSolution.length <= 0) ? "error" : null)) }>
						<ControlLabel>Løsningsforslag *</ControlLabel>
						<FormControl componentClass="textarea"  onChange={ (a:any) =>  { this._suggestion.SuggestedSolution =  this.set(a); this.update(); }} value={this._suggestion.SuggestedSolution} />
                             <FormControl.Feedback />                              
                        </FormGroup>                   
					
                         <FormGroup>
                            <ControlLabel>Hvilken type nytte?</ControlLabel>						
                        <select id="select-1" className="form-control"
                            onChange={ (a:any) =>  { this._suggestion.UsefulnessType = this.set(a); this.update(); } } value={this._suggestion.UsefulnessType} >
                            {this._type.map( (val:string, index:number) => { 
                                return <option value={val}>{val}</option>
                            })}							
						</select>
                        { (this._suggestion.UsefulnessType != "Annet") ? "" : 
                        <input id="annet" type="text" onChange={ (a:any) =>  { this._suggestion.UsefulnessType = this.set(a); this.update(); } }/>}
                        </FormGroup>  
                        <FormGroup>   
						<label htmlFor="nyttig">Nyttig for andre?</label>
						<input id="nyttig" type="text" placeholder="Kan forslaget ditt være nyttig for andre enn deg/din virksomhet?"
                            onChange={ (a:any) =>  { this._suggestion.UsefulForOthers = this.set(a); this.update(); } } value={this._suggestion.UsefulForOthers}
                        />
                        </FormGroup>
                        </Col>
                       </Row>
					</div>
                    </div>                
                    </Col>
            </Row>                    
        )
    }
}