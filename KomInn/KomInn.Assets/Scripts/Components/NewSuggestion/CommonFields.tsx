import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 

/* TODO: Implement validation */ 
interface CommonFieldsProps { onSuggestionUpdate?(suggestion:Suggestion):void }

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

    formValidates():boolean
    {        
        if(this._suggestion.Title.length <= 0)
            return false; 
        if(this._suggestion.Challenges.length <= 0)
            return false; 
        if(this._suggestion.SuggestedSolution.length <= 0)
            return false; 

        return true; 
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
						<label htmlFor="tittel">Tittel *</label>
						<input id="tittel" type="text" 
                            onChange={ (a:any) =>  { this._suggestion.Title =  this.set(a); this.update(); }} value={this._suggestion.Title} />
						<label htmlFor="sammendrag">Sammendrag</label>
						<textarea id="sammendrag" colSpan={30} rowSpan={10} placeholder="Beskriv forslaget ditt med to setninger."
                        onChange={ (a:any) =>  this._suggestion.Summary = this.set(a) } value={this._suggestion.Summary}
                        ></textarea>
					</Col>
                    </Row>
                    <Row>
                        <Col xs={12}>					
						<label htmlFor="utfordringer">Utfordring *</label>
						<textarea id="utfordringer" colSpan={30} rowSpan={10} placeholder="Beskriv utfordringen(e) dette forslaget er ment å ta tak i. Hvorfor er det viktig å ta tak i dette?"
                            onChange={ (a:any) => { this._suggestion.Challenges = this.set(a);  this.update();  }} value={this._suggestion.Challenges} ></textarea>
						<label htmlFor="løsningsforslag">Løsningsforslag *</label>
						<textarea id="løsningsforslag" colSpan={30} rowSpan={10} placeholder="Beskriv forslaget til løsning mer detaljert. Vet du noe om hva dette vil koste? Er det andre som må være med på å realiser løsningen? Etc.."
                            onChange={ (a:any) =>  { this._suggestion.SuggestedSolution = this.set(a); this.update(); }  } value={this._suggestion.SuggestedSolution}
                        ></textarea>
					</Col>
                    </Row>
					<Row>
                        <Col xs={12}>
						<label htmlFor="select-1">Hvilken type nytte?</label>                    
                        <select id="select-1" className="form-control"
                            onChange={ (a:any) =>  { this._suggestion.UsefulnessType = this.set(a); this.update(); } } value={this._suggestion.UsefulnessType} >
                            {this._type.map( (val:string, index:number) => { 
                                return <option value={val}>{val}</option>
                            })}							
						</select>
                        { (this._suggestion.UsefulnessType != "Annet") ? "" : 
                        <input id="annet" type="text"/>}
                        
						<label htmlFor="nyttig">Nyttig for andre?</label>
						<input id="nyttig" type="text" placeholder="Kan forslaget ditt være nyttig for andre enn deg/din virksomhet?"
                            onChange={ (a:any) =>  { this._suggestion.UsefulForOthers = this.set(a); this.update(); } } value={this._suggestion.UsefulForOthers}
                        />
                        </Col>
                        </Row>
					</div>
                    </div>
                    </Col>
            </Row>                    
        )
    }
}