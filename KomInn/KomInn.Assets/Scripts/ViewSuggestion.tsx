import * as React from "react";

import { Searchbar } from "./Components/Frontpage/Searchbar";
import { Content } from "./Components/ViewSuggestion/Content";
import { Actions } from "./Components/ViewSuggestion/Actions";
import { Summary }from "./Components/ViewSuggestion/Summary";
import { Map }from "./Components/ViewSuggestion/Map"; 
import { InspiredBy } from "./Components/ViewSuggestion/InspiredBy"; 
import { Comments } from "./Components/ViewSuggestion/Comments";

export class ViewSuggestion extends React.Component<any, any>
{
    render()
    {
        return (
        <div className="container-fluid">
            <Searchbar />
            <div className="col-md-8">
                <Content />
                <Summary />
                <InspiredBy />
                <Comments/>
            </div>
            <div className="col-md-4">
                <Actions />
                <Map />
            </div>
        </div>   
        )
    }
}