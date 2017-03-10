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
            <section className="section-frame">
                <div className="container">
                    <div className="box-wrapp">
                        <Content />
                    </div>
                    <div id="sidebar">
                        <Actions />
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
                                    <Summary />
                                    <InspiredBy />
                                </div>
                                <div id="tab2">
                                    <Comments/>
                                </div>
                                <div id="tab3"><span className="hidden">About tab</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        )
    }
}