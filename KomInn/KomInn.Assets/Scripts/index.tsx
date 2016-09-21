import * as React from "react";
import * as ReactDOM from "react-dom";

import { NewSuggestionForm } from "./NewSuggestionForm";
import { AllSuggestions } from "./AllSuggestions";


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
if(document.getElementById("form") != null)
    renderSuggestionForm("form");

if(document.getElementById("allsuggestions") != null)
    renderShowAllSuggestions("allsuggestions");




