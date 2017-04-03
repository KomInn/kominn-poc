import * as React from "react";
import * as ReactDOM from "react-dom";

import { NewSuggestion } from "./NewSuggestion";
import { Frontpage } from "./Frontpage";
import { ViewSuggestion }  from "./ViewSuggestion";



function renderSuggestionForm(id:string) 
{
    ReactDOM.render(
    <NewSuggestion />,
        document.getElementById(id)
    );
}

function renderShowAllSuggestions(id:string)
{
    ReactDOM.render(
    <Frontpage />,
        document.getElementById(id)
    );
}

function renderViewSuggestions(id:string)
{
    ReactDOM.render(
    <ViewSuggestion />,
        document.getElementById(id)
    );
}


if(document.getElementById("form") != null)
    renderSuggestionForm("form");

if(document.getElementById("allsuggestions") != null)
    renderShowAllSuggestions("allsuggestions");

if(document.getElementById("forslag") != null)
    renderViewSuggestions("forslag");


