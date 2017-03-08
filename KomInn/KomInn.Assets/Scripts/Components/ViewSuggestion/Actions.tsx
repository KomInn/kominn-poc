import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class Actions extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <div id="wrapper">
					<div class="sub-box">
						<div class="list-holder">
							<strong class="title-block"><span class="counter">128</span>Likes</strong>
							<ul class="btn-list">
								<li class="active"><a href="#" class="btn icon"><i class="icon-like"></i>Like</a></li>
								<li><a href="#" class="btn">Kommenter</a></li>
								<li><a href="#" class="btn">Kopier forslag</a></li>
							</ul>
						</div>
					</div>
					<div class="sub-box">
						<h3>Del gjerne forslaget</h3>
						<p>Dersom du liker dette forslaget setter vi pris på om du deler det med familie, venner og kjente. Takk! </p>
						<ul class="social-network">
							<li><a href="#"><i class="icon-facebook"></i></a></li>
							<li><a href="#"><i class="icon-email"></i></a></li>
							<li><a href="#"><i class="icon-sms"></i></a></li>
							<li><a href="#"><i class="icon-instagram"></i></a></li>
						</ul>
					</div>
                </div>                 
            </Row>                    
        )
    }
}

