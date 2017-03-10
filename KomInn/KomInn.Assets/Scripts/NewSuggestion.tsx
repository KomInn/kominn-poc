import * as React from "react";
import { CommonFields } from "./Components/NewSuggestion/CommonFields"
import { Personalia } from "./Components/NewSuggestion/Personalia";
import { UploadImages } from "./Components/NewSuggestion/UploadImages";
import { AddLocation } from "./Components/NewSuggestion/AddLocation";
import { InspiredBy } from "./Components/NewSuggestion/InspiredBy";
import { Suggestion } from "./Components/Common/Suggestion"; 
import { Person } from "./Components/Common/Person"; 
import { DataAdapter } from "./Components/Common/DataAdapter";

interface NewSuggestionState { suggestion:Suggestion, formInvalid:boolean }
export class NewSuggestion extends React.Component<any, NewSuggestionState>
{
    
    constructor() 
    {
        super(); 
        this.state ={ suggestion:new Suggestion(), formInvalid:false};        
    }
    updateSuggestion(s:Suggestion)
    {       
        this.setState({suggestion:s});
    }
    updatePerson(p:Person)
    {
        var s = this.state.suggestion; 
        s.Submitter = p; 
        this.setState({suggestion:s});
    }
    updateImage(pictureURL:string)
    {
        var s = this.state.suggestion; 
        s.Image = pictureURL;
        this.setState({suggestion:s}); 
    }
    updateLocation(location:string)
    {
        var s = this.state.suggestion; 
        s.Location = location; 
        this.setState({suggestion:s}); 
    }
    updateInspiredBy(inspiredby:Array<Suggestion>)
    {
        var s = this.state.suggestion; 
        s.InspiredBy = inspiredby; 
        this.setState({suggestion:s});         
    }

    submitSuggestion()
    {
        if(!this.state.suggestion.Validates)
        {
            this.setState({formInvalid:true}); 
            return; 
        }                
        var d = new DataAdapter();
        d.submitSuggestion(this.state.suggestion); 
    }

    render()
    {
        return (
            <div className="container-fluid newsuggestion-container contacts-form">
                <CommonFields onSuggestionUpdate={this.updateSuggestion.bind(this)}  />
                <Personalia onDataUpdate={this.updatePerson.bind(this)} />                    
                <UploadImages onDataUpdate={this.updateImage.bind(this)} />
                <AddLocation onDataUpdate={this.updateLocation.bind(this)} />
                <InspiredBy onDataUpdate={this.updateInspiredBy.bind(this)} />
                <div className="form-area">
                    <ul className="btn-list">
					    <li><a href="#" className="btn" onClick={this.submitSuggestion.bind(this)}>Send inn</a></li>							
				    </ul>
                </div>
            </div>)
    }
}
