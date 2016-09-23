import * as React from "react";
import * as ReactDOM from "react-dom";

import { NewSuggestionForm } from "./NewSuggestionForm";
import { AllSuggestions } from "./AllSuggestions";
import { ViewSuggestion }  from "./ViewSuggestion";


function renderSuggestionForm(id:string) 
{
    ReactDOM.render(
    <NewSuggestionForm />,
        document.getElementById(id)
    );
}

function renderShowAllSuggestions(id:string)
{
    ReactDOM.render(
    <AllSuggestions />,
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



