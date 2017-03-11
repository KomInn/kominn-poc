import * as React from "react";

import { Searchbar } from "./Components/Frontpage/Searchbar";
import { Content } from "./Components/ViewSuggestion/Content";
import { Actions } from "./Components/ViewSuggestion/Actions";
import { Summary }from "./Components/ViewSuggestion/Summary";
import { Map }from "./Components/ViewSuggestion/Map"; 
import { InspiredBy } from "./Components/ViewSuggestion/InspiredBy"; 
import { Comments } from "./Components/ViewSuggestion/Comments";
import { Suggestion } from "./Components/Common/Suggestion";
import { DataAdapter } from "./Components/Common/DataAdapter";
import { Comment } from "./Components/Common/Comment";

interface ViewSuggestionState { suggestion:Suggestion }
export class ViewSuggestion extends React.Component<any, ViewSuggestionState>
{
    constructor()
    {
        super();
        this.state = { suggestion:new Suggestion() }; 
    }
    componentWillMount()
    {        
        this.loadSuggestion();         
    }

    loadSuggestion()
    {        
        var id = GetUrlKeyValue("forslag");        
        if(id == null || id == "") 
        {
            this.redirectToFrontpage();
            return; 
        }
        var da = new DataAdapter();
        da.getSuggestionById(id).then( 
            (s:Array<Suggestion>) => {                 
                if(s.length <= 0)
                {
                    this.redirectToFrontpage();
                    return; 
                }
                da.getCommentsForSuggestion(s[0]).then( (result:Suggestion) => {                 
                    this.setState({suggestion:result}); 
                });
             });       
    }

    redirectToFrontpage()
    {
         document.location.href = _spPageContextInfo.webAbsoluteUrl; 
    }
    render()
    {        
          if(this.state.suggestion == null || this.state.suggestion.Id == -1)
            return <div></div>; 

        return (
        <div className="container-fluid">
            <Searchbar />
            <section className="section-frame">
                <div className="container">
                    <div className="box-wrapp">
                        <Content suggestion={this.state.suggestion} />
                    </div>
                    <div id="sidebar">
                        <Actions suggestion={this.state.suggestion} onLikeUpdated={this.loadSuggestion.bind(this)} />
                        <Map />
                    </div>
                    <div className="box-wrapp">
                        <div className="content">
                            <ul className="tabset">
                                <li><a href="#tab1" className="active">Detaljer</a></li>
                                <li><a href="#tab2">Kommentarer</a></li>
                                <li><a href="#tab3">Kopier</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="tab1" className="active">
                                    <Summary  suggestion={this.state.suggestion}  />
                                    <InspiredBy  suggestion={this.state.suggestion}  />
                                </div>
                                <div id="kommentar">
                                    <Comments  suggestion={this.state.suggestion} onCommentSubmitted={this.loadSuggestion.bind(this)} />
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        )
    }
}