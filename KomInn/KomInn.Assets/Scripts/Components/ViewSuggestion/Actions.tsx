import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";
import { DataAdapter } from "../Common/DataAdapter";
interface ActionsProps { suggestion?:Suggestion, onLikeUpdated():void }
export class Actions extends React.Component<ActionsProps, any>
{

	like()
	{
		var da = new DataAdapter(); 
		da.updateLike(this.props.suggestion).then( () => { this.props.onLikeUpdated() }); 
	}

    render()
    {
        return (
            <Row>                
				<div className="sub-box">
					<div className="list-holder">
						{ (this.props.suggestion.Likes <= 0) ? "" : 
						<strong className="title-block"><span className="counter">{this.props.suggestion.Likes}</span>Like {(this.props.suggestion.Likes > 1) ? "s" : "" }</strong>}
						<ul className="btn-list">
							<li className="active"><a href="#" onClick={this.like.bind(this)} className="btn icon"><i className="icon-like"></i>Like</a></li>
							<li><a href="#kommentar" className="btn">Kommenter</a></li>
							<li><a href={this.props.suggestion.CopyUrl} className="btn">Kopier forslag</a></li>
						</ul>
					</div>
				</div>
				<div className="sub-box">
					<h3>Del gjerne forslaget</h3>
					<p>Dersom du liker dette forslaget setter vi pris på om du deler det med familie, venner og kjente. Takk! </p>
					<ul className="social-network">
						<li><a href="#"><i className="icon-facebook"></i></a></li>
						<li><a href="#"><i className="icon-email"></i></a></li>
						<li><a href="#"><i className="icon-sms"></i></a></li>
						<li><a href="#"><i className="icon-instagram"></i></a></li>
					</ul>
				</div>
            </Row>                    
        )
    }
}

