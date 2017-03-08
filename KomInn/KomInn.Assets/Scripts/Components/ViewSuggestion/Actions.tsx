import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class Actions extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <section className="item-section">
                    <div className="item-holder">
						<div className="sub-box">
							<div className="list-holder">
								<strong className="title-block"><span className="counter">128</span>Likes</strong>
								<ul className="btn-list">
									<li className="active"><a href="#" className="btn icon"><i className="icon-like"></i>Like</a></li>
									<li><a href="#" className="btn">Kommenter</a></li>
									<li><a href="#" className="btn">Kopier forslag</a></li>
								</ul>
							</div>
						</div>
					</div>
                    <div className="item-holder">
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
					</div>
				</section>                 
            </Row>                    
        )
    }
}

