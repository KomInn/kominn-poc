import * as React from "react";

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
            // ../Frontpage/Search
            // Content
            // Actions
            // Summary
            // Map
            // Inspired by
            // Comments 
            <Searchbar />
            <Content />
            <Actions />
            <Summary />
            <Map />
            <InspiredBy />
            <Comments/>
        </div>   
        )
    }
}