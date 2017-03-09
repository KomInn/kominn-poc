import * as React from "react";

import { Searchbar } from "./Components/Frontpage/Searchbar";
import { PromotedSuggestions } from "./Components/Frontpage/PromotedSuggestions";
import { PopularSuggestions } from "./Components/Frontpage/PopularSuggestions";
import { SuccessStories } from "./Components/Frontpage/SuccessStories"; 
import { MySuggestions }from "./Components/Frontpage/MySuggestions"; 
import { DataAdapter } from "./Components/Common/DataAdapter"; 

import { Suggestion } from "./Components/Common/Suggestion"; 

interface FrontpageState { suggestions:Array<Suggestion> }
export class Frontpage extends React.Component<any, FrontpageState>
{
    constructor()
    {
        super();
        this.state = { suggestions:new Array<Suggestion>() };
        var d = new DataAdapter();
        d.getAllSuggestions().then( (results:Array<Suggestion>)  => { 
            this.setState({suggestions:results}); 
        });
    }
    render()
    {
        return (
            <div className="container-fluid">
                <Searchbar />
                <PromotedSuggestions suggestions={this.state.suggestions} />
                <PopularSuggestions suggestions={this.state.suggestions} />
                <SuccessStories suggestions={this.state.suggestions} />
                <MySuggestions suggestions={this.state.suggestions}/>
                <a className="accessibility" href="#wrapper">Back to top</a>
            </div>           
        )
    }
}