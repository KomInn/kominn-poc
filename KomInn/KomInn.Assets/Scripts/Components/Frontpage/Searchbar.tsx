import * as React from "react";
import { Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";
import { DataAdapter } from "../Common/DataAdapter";

interface InspiredByState { inspiredBy:Array<Suggestion>, suggestions:Array<Suggestion>, searchval?:string }
export class Searchbar extends React.Component<any, InspiredByState>
{
     constructor()
    {
        super();
        this.state = { suggestions:new Array<Suggestion>(), inspiredBy:new Array<Suggestion>(), searchval:"" };
    }
     searchSuggestion(evt:any)
    {            
        this.setState({searchval:evt.target.value}, () => {                       
            var title = this.state.searchval;  
            if(title == null || title == "" || title.length <= 3)
            {
                this.setState({suggestions:new Array<Suggestion>()});
                return;
            }

            var d = new DataAdapter();
            d.getSuggestionByTitle(title).then( (result:Array<Suggestion>) => {             
                this.setState({suggestions:result}); 
            }); 
        });
    }
    render()
    {
        var url = _spPageContextInfo.webAbsoluteUrl + "/SitePages/NyttForslag.aspx"; 
        return (
            <Row className="searchbar">
                <Col xs={12}>
           
            <Row>  
               		  
                        <Col  md={4} mdPush={1} sm={4} xs={12} lg={4} lgPush={2}>
                            <input id="search" type="search" placeholder="Søk etter forslag" onChange={this.searchSuggestion.bind(this)} value={this.state.searchval} />                            
				        </Col>
                        <Col md={6} mdPush={1} sm={8} xs={12} lg={5} lgPush={2}>    
                        <a href={url} className="btn green">Søk innovasjonsmidler 2017</a>                        
                        <a href={url} className="btn green" style={{marginLeft:"4px"}} >Fortell hva dere har fått til</a>	                      
                        </Col>                        
            </Row>  
            { (this.state.suggestions.length < 0) ? "" : 
            <Row>
                <Col>                                 
                 <ListGroup>
                            {this.state.suggestions.map( (item:Suggestion, index:number) => {         
                            return (                            
                                    <ListGroupItem>
                                        {item.Image == "" ? "" :
                                        <img src={item.Image} style={{width:"64px", verticalAlign:"middle", marginRight:"10px"}}/>}
                                        <a href={item.Url}>{item.Title}</a>
                                    </ListGroupItem>
                            )
                            })}
                            </ListGroup>
                </Col>
                </Row>}  
                </Col> 
                </Row>    
        )
    }
}