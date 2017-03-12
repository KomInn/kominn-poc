import * as React from "react";

import { Searchbar } from "./Components/Frontpage/Searchbar";
import { PromotedSuggestions } from "./Components/Frontpage/PromotedSuggestions";
import { PopularSuggestions } from "./Components/Frontpage/PopularSuggestions";
import { SuccessStories } from "./Components/Frontpage/SuccessStories"; 
import { MySuggestions }from "./Components/Frontpage/MySuggestions"; 
import { DataAdapter } from "./Components/Common/DataAdapter"; 

import { Suggestion } from "./Components/Common/Suggestion"; 


export class Frontpage extends React.Component<any, any>
{
    constructor()
    {
        super();
        
      
    }
    render()
    {
        return (
            <div className="container-fluid">
                <Searchbar />
                <PromotedSuggestions  />
                <PopularSuggestions />
                <SuccessStories  />
                <MySuggestions />
                <a className="accessibility" href="#wrapper">Back to top</a>
            </div>           
        )
    }
}