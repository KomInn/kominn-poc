import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
interface SuccessStoriesState { Suggestions:Array<Suggestion> }
export class SuccessStories extends React.Component<any, SuccessStoriesState>
{
    render()
    {
        return (
    <Row>        
       <section className="carousel-section">
			<div className="container">
				<h2>Suksesshistorier</h2>
				<div className="carousel">
					<div className="mask">
						<div className="slideset">
							<div className="slide">
								<article className="slide-holder">
									<div className="img-block">
									</div>
									<div className="content-area">
										<strong className="title">Studio / Galleri</strong>
										<p>Se hvordan forslaget til Erik Dahle om å kombinerer et kunststudio og galleri i bakhagen ble til virkelighet. Her kan barnehager og skoler komme for å utforske kunst, form og farger. Anbefales.</p>
										<ul className="btn-list">
											<li><a href="#" className="btn beige">Vis</a></li>
											<li><a href="#" className="btn beige">Kopier forslag</a></li> 
										</ul>
									</div>
								</article>
							</div>
						</div>
					</div>
					<a className="btn-prev" href="#"><i className="icon-arrow-l"></i></a>
					<a className="btn-next" href="#"><i className="icon-arrow-r"></i></a>
					<div className="pagination">
						<ul>
							<li><a href="#"><span className="hidden">bullet</span></a></li>
							<li className="active"><a href="#"><span className="hidden">bullet</span></a></li>
							<li><a href="#"><span className="hidden">bullet</span></a></li>
						</ul>
					</div>
				</div>
				<a href="#" className="btn blue">Vis alle suksesshistoriene</a>
			</div>
		</section>
</Row>)
    }
}