import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
interface MySuggestionsState { Suggestions:Array<Suggestion> }
export class MySuggestions extends React.Component<any, MySuggestionsState>
{
    render()
    {
        return (
    <Row>        
      <section className="section-offers hidden-xs">
			<div className="container">
				<h2>Mine forslag</h2>
				<div className="offers-table">
					<div className="table-row">
						<div className="col">
							<a href="#" className="title-block">
								<div className="img-block">
									<img src="images/placeholder.jpg" width="49" height="49" alt="image description"/>
								</div>
								<strong className="title">Bygg en lekeplass for barna</strong>
							</a>
						</div>
						<div className="col">
							<time>25.01.2017</time>
						</div>
						<div className="col">
							<div className="counter-block">
								<i className="icon-like"></i>
								<span className="counter">351</span>
							</div>
						</div>
						<div className="col">
							<a href="#" className="btn-link">Innsendt</a>
						</div>
						<div className="col">
							<a href="#" className="btn-close"><span className="hidden">X</span></a>
						</div>
					</div>
					<div className="table-row">
						<div className="col">
							<a href="#" className="title-block">
								<div className="img-block">
									<img src="images/placeholder.jpg" width="49" height="49" alt="image description" />
								</div>
								<strong className="title">Hva med utendørs buldrevegg på Festningen?</strong>
							</a>
						</div>
						<div className="col">
							<time >13.12.2016</time>
						</div>
						<div className="col">
							<div className="counter-block">
								<i className="icon-like"></i>
								<span className="counter">12</span>
							</div>
						</div>
						<div className="col">
							<a href="#" className="btn-link">Send inn</a>
						</div>
						<div className="col">
							<a href="#" className="btn-close"><span className="hidden">X</span></a>
						</div>
					</div>
				</div>
			</div>
		</section>

</Row>)
    }
}