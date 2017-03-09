import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
import { DataAdapter } from "../Common/DataAdapter"; 
import { Status } from "../Common/Status"; 
interface PopularSuggestionsState { suggestions:Array<Suggestion> }
export class PopularSuggestions extends React.Component<any, PopularSuggestionsState>
{
    constructor()
    {
        super();
        this.state = { suggestions:new Array<Suggestion>()};
    }
    componentWillMount()
    {
        var d = new DataAdapter();
        d.getAllSuggestions(Status.Published, 3).then( (results:Array<Suggestion>)  => {             
            this.setState({suggestions:results}); 
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
                {this.state.suggestions.map( (item:Suggestion, index:number) => {
                return ( <article className="item-wrapp">
                    <div className="item">
                        <a href="#" className="img-block">
                            { item.Image == "" ? "" : 
                            <img src={item.Image} width="298" height="200" alt="image description"/>}
                        </a>
                        <div className="item-content">
                            <h3><a href="#">{item.Title}</a></h3>
                            <div className="text-block same-height-left">
                                <p>{item.Summary}</p>
                            </div>
                            <footer>
                                <time>{item.Created.getDate() + "." + (item.Created.getMonth()+1) +"."+ item.Created.getFullYear()}</time>
                                <strong className="author">{item.Submitter.Name}</strong>
                                <span>{item.Location}</span>
                            </footer>
                            <ul className="btn-list">
                                <li>
                                    <a href="#"><i className="icon-like"></i><span className="counter">{item.Likes}</span></a>
                                </li>
                                <li>
                                    <a href="#"><i className="icon-comments"></i><span className="counter">{item.NumberOfComments}</span></a>
                                </li>
                        </ul>
                    </div>
                </div>
            </article>);
                })
            };           
        </div>
        <a href="#" className="btn">Vis flere populære forslag</a>    
        </div>
</section>
</Row>)
    }
}