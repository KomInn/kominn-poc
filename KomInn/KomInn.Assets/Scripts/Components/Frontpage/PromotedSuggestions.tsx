import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
interface PromotedSuggestionsState { CarouselImages:Array<Suggestion> }
export class PromotedSuggestions extends React.Component<any, PromotedSuggestionsState>
{
    render()
    {
        return (
            <Row>
            <div className="gallery-block">
			<div className="gallery">
				<div className="mask">
					<div className="slideset">
						<div className="slide">
							<div className="text-block">
								<p>Forslag #768</p>
								<h1>Lokale godbiter</h1>
							</div>
						</div>
					</div>
				</div>
				<a className="btn-prev" href="#"><i className="icon-arrow-l"></i></a>
				<a className="btn-next" href="#"><i className="icon-arrow-r"></i></a>
			</div>
			<div className="text-box">
				<p>La oss få restaurere den gamle butikken på hjørnet! Vi har gode planer!</p>
			</div>
		</div>
        </Row>
              
        )
    }
}