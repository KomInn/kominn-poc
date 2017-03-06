import * as React from "react";

import { Searchbar } from "./Components/Frontpage/Searchbar";
import { PromotedSuggestions } from "./Components/Frontpage/PromotedSuggestions";
import { PopularSuggestions } from "./Components/Frontpage/PopularSuggestions";
import { SuccessStories } from "./Components/Frontpage/SuccessStories"; 
import { MySuggestions }from "./Components/Frontpage/MySuggestions"; 
export class Frontpage extends React.Component<any, any>
{
    render()
    {
        return (
            <div className="container-fluid">
                <Searchbar />
                <PromotedSuggestions />
                <PopularSuggestions />
                <SuccessStories />
                <MySuggestions />
                <a className="accessibility" href="#wrapper">Back to top</a>
            </div>
           
            // Promoted suggestions
            // Popular suggestions
            // Success-stories
            // My suggestions
        )
    }
}