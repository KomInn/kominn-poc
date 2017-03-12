import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
import { DataAdapter } from "../Common/DataAdapter"; 
import { Status } from "../Common/Status"; 
interface PromotedSuggestionsState { suggestions?:Array<Suggestion>, CurrentImage?:number }

export class PromotedSuggestions extends React.Component<any, PromotedSuggestionsState>
{
	constructor()
	{
		super(); 
		this.state ={ suggestions:new Array<Suggestion>(), CurrentImage:0 }; 
	}

	componentWillMount()
	{
		 var d = new DataAdapter();
        d.getAllSuggestions(Status.Promoted, 50).then( (results:Array<Suggestion>)  => {             
            this.setState({suggestions:results}); 
        });
	}

	setNextImage()
	{
		
		if(this.state.CurrentImage+1 >= this.state.suggestions.length )
		{
			this.setState({CurrentImage:0}); 
			return; 
		}

		this.setState({CurrentImage:this.state.CurrentImage+1}); 		
	}

	setPrevImage()
	{
		if(this.state.CurrentImage-1 <= -1)
		{
			this.setState({CurrentImage:this.state.suggestions.length-1}); 
			return; 
		}

		this.setState({CurrentImage:this.state.CurrentImage-1}); 		
	}

	showArrows()
	{		
		if(this.state.suggestions.length <= 1)
			return <span></span>

		return (<span><a className="btn-prev" href="#" onClick={this.setPrevImage.bind(this)}><i className="icon-arrow-l"></i></a>
		<a className="btn-next" href="#" onClick={this.setNextImage.bind(this)}><i className="icon-arrow-r"></i></a></span>)
				
	}

    render()
    {
		if(this.state.suggestions.length <= 0)
			return(<div></div>)

		var item = this.state.suggestions[this.state.CurrentImage];		
		
        return (
            <Row>
            <div className="gallery-block">
			<div className="gallery">
				<div className="mask">
					<div className="slideset">						
						<div className="slide" style={{backgroundImage:"url('"+item.Image+"')"}}>
							<div className="text-block">
								<p>Forslag #{item.Id}</p>
								<h1><a href={item.Url} style={{color:"white"}}>{item.Title}</a></h1>
							</div>
						</div>						
					</div>
				</div>
				{this.showArrows()}
				
			</div>
			<div className="text-box">
				<p>{item.Summary}</p>
			</div>
		</div>
        </Row>
              
        )
    }
}