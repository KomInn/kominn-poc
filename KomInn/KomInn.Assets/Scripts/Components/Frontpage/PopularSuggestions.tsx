import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
import { DataAdapter } from "../Common/DataAdapter"; 
import { Status } from "../Common/Status"; 
import { Tools } from "../Common/Tools"; 
interface PopularSuggestionsState { suggestions:Array<Suggestion>, top?:number, maxReached?:boolean }
export class PopularSuggestions extends React.Component<any, PopularSuggestionsState>
{

    constructor()
    {
        super();
        this.state = { suggestions:new Array<Suggestion>(), top:3, maxReached:false };
    }
    componentWillMount()
    {
        this.loadMoreSuggestions();
    }

    loadMoreSuggestions()
    {
        var count = this.state.suggestions.length;
        var d = new DataAdapter();
        d.getAllSuggestions(Status.Published, this.state.top ).then( (results:Array<Suggestion>)  => {                         
            if(count == results.length)
                this.setState({maxReached:true});

            this.setState({suggestions:results},() => this.setState({top:this.state.top+3 }));             
        });
    }

    render()
    {       
        if(this.state.suggestions.length <= 0)            
            return (<div></div>);

        return (
    <Row>        
        <section className="item-section">
            <div className="item-container">
        <h2>Populære forslag</h2>			
            <div className="item-holder">
                <Row>
                {this.state.suggestions.map( (item:Suggestion, index:number) => {                
                return ( 
                    <Col xs={4}>
                    <article className="item">                   
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
            </article>
            </Col>)
                })
            } 
            </Row>          
        </div>     
        {(this.state.maxReached) ? "" : 
        <a href="#" className="btn" onClick={this.loadMoreSuggestions.bind(this)}>Vis flere populære forslag</a>}
        </div>
</section>
</Row>)
    }
}