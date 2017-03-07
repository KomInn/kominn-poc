import * as React from "react";
import { CommonFields } from "./Components/NewSuggestion/CommonFields"
import { Personalia } from "./Components/NewSuggestion/Personalia";
import { UploadImages } from "./Components/NewSuggestion/UploadImages";
import { AddLocation } from "./Components/NewSuggestion/AddLocation";
import { InspiredBy } from "./Components/NewSuggestion/InspiredBy";

import { Suggestion } from "./Components/Common/Suggestion"; 
import { Location } from "./Components/Common/Location"; 
import { Person } from "./Components/Common/Person"; 

interface NewSuggestionState { suggestion:Suggestion,  }
export class NewSuggestion extends React.Component<any, NewSuggestionState>
{
    constructor() 
    {
        super(); 
        this.state ={ suggestion:new Suggestion()}; 

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
    render()
    {
        return (
            <div className="container-fluid newsuggestion-container contacts-form">
                <CommonFields onSuggestionUpdate={this.updateSuggestion.bind(this)}  />
                <Personalia onDataUpdate={this.updatePerson.bind(this)} />                    
                <UploadImages onDataUpdate={this.updateImage.bind(this)} />
                <AddLocation />
                <InspiredBy />
                <div className="form-area hidden-xs">
                    <ul className="btn-list">
					    <li><a href="#" className="btn">Send inn</a></li>							
				    </ul>
                </div>
            </div>)
    }
}
