import * as React from "react";
import { Row, Col } from "react-bootstrap";

interface SearchBarProperties { onSuggestionSelected?():void }
interface SearchBarState {  }
export class Searchbar extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <div id="wrapper">
                    <div className="search-area">
			            <div action="#" className="search-form">				    
				            <input id="search" type="search" placeholder="Søk etter forslag" />
				            <button type="submit"><i className="icon-search"></i></button>
                        </div>		
                    </div> 
                </div>                 
            </Row>                    
        )
    }
}