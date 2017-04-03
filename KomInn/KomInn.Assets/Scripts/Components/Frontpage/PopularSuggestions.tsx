import * as React from "react";
import { Row, Col, Glyphicon, Button, FormGroup, ControlLabel } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
import { DataAdapter } from "../Common/DataAdapter"; 
import { Status } from "../Common/Status"; 
import { Tools } from "../Common/Tools"; 
import * as _ from "lodash"; 

enum SortTypes { DateAsc, DateDesc }

interface PopularSuggestionsState { suggestions:Array<Suggestion>, top?:number, maxReached?:boolean, sorting?:SortTypes }
export class PopularSuggestions extends React.Component<any, PopularSuggestionsState>
{

    constructor()
    {
        super();
        
        this.state = { suggestions:new Array<Suggestion>(), top:3, maxReached:false, sorting:SortTypes.DateDesc};
    }
    componentWillMount()
    {        
        this.loadSuggestions(3);
    }

    loadMoreSuggestions()
    {
        this.loadSuggestions(3); 
    }


    loadSuggestions(incrementTop?:number)
    {
        var customSort = ""; 
        if(this.state.sorting != null)
            {
                if(this.state.sorting == SortTypes.DateAsc)
                    customSort = "&$orderby=Created asc"; 
                else 
                    customSort = "&$orderby=Created desc"; 
            }

        var count = this.state.suggestions.length;
        var d = new DataAdapter();
        d.getAllSuggestions(Status.Published, this.state.top, null, customSort ).then( (results:Array<Suggestion>)  => {                         
            console.log("COUMNT");
            console.log(count);
            console.log(results.length);
            if(count == results.length)
                this.setState({maxReached:true});

            this.setState({suggestions:results},() => this.setState({top:this.state.top+incrementTop }));             
        });
    }

    suggestionCardTemplate(item:Suggestion):JSX.Element {
        return (<article className="item">                   
                        <a href={item.Url} className="img-block">
                            { item.Image == "" ? "" : 
                            <img src={item.Image} width="298" height="200" alt="image description"/>}
                        </a>
                        <div className="item-content">
                            <h3><a href={item.Url}>{item.Title}</a></h3>
                            <div className="text-block same-height-left">
                                <p>{item.Summary}</p>
                            </div>
                            <footer>
                                <time>{item.Created.getDate() + "." + (item.Created.getMonth()+1) +"."+ item.Created.getFullYear()}</time>
                                <strong className="author">{item.Submitter.Name}</strong>
                                { (Tools.IsLatLong(item.Location)) ? "" : 
                                <span>{item.Location}</span>}
                                 <ul className="btn-list">
                                <li>
                                    <a href="#"><i className="icon-like"></i><span className="counter">{item.Likes}</span></a>
                                </li>
                                <li>
                                    <a href="#"><i className="icon-comments"></i><span className="counter">{item.NumberOfComments}</span></a>
                                </li>
                        </ul>
                    </footer>                           
                </div>                
            </article>);
    }

    
    generatePopularSuggestions()
    {
        var items = this.state.suggestions;          
        return _.chunk(items, 3).map( ((item:Array<Suggestion>) => {           
            return (<Row>{ item.map( (i:Suggestion) => { return (<Col xs={4}>{this.suggestionCardTemplate(i)}</Col>) })}</Row>)
        }).bind(this));
    }

    sortSuggestions(val:any)
    {
        console.log(val.target.value); 
        this.setState({sorting: (val.target.value == 2) ? SortTypes.DateAsc : SortTypes.DateDesc}, () => { this.loadSuggestions(0); });
        
    }

    render()
    {       
        
        if(this.state.suggestions.length <= 0)            
            return (<div></div>);

        return (
    <Row>        
        <section className="item-section">
            <div className="item-container">
        <h2>Populære forslag <div><Button><Glyphicon glyph="filter"/></Button><Button><Glyphicon glyph="sort"/></Button></div></h2>	
            <div className="sortoptions" style={{paddingBottom:"10px"}}>
                  <FormGroup>
                            <ControlLabel>Sorter på: </ControlLabel>						
                        <select className="form-control" onChange={this.sortSuggestions.bind(this)}>
                            <option value="1">Dato nyest - eldst</option>
                            <option value="2">Dato eldst - nyest</option>                               
						</select>                        
                    </FormGroup>  
            </div>		
            <div className="item-holder">
               
                    
                <Col xs={12}>                
                {this.generatePopularSuggestions()}    
                </Col>
            </div>     
        {(this.state.maxReached) ? "" : 
        <a href="#" className="btn" onClick={this.loadMoreSuggestions.bind(this)}>Vis flere populære forslag</a>}
        </div>
</section>
</Row>)
    }
}