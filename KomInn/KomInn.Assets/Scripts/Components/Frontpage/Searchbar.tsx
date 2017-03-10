import * as React from "react";
import { Row, Col } from "react-bootstrap";

interface SearchBarProperties { onSuggestionSelected?():void }
interface SearchBarState {  }
export class Searchbar extends React.Component<any, any>
{
    render()
    {
        var url = _spPageContextInfo.webAbsoluteUrl + "/SitePages/NyttForslag.aspx"; 
        return (
            <Row>                
                <div id="wrapper">
                    <div className="search-area">   
                        <div className="search-container">                    
			            <div action="#" className="search-form">				    
				            <input id="search" type="search" placeholder="Søk etter forslag" />
				            <button type="submit"><i className="icon-search"></i></button>
                        </div>                      
                        <a href={url} className="btn green">Søk innovasjonsmidler 2017</a>
                        <a href={url} className="btn green">Fortell hva dere har fått til</a>	                      
                        </div>
                    </div> 
                </div>                 
            </Row>                    
        )
    }
}