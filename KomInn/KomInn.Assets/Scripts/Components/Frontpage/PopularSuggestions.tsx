import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 
interface PopularSuggestionsState { Suggestions:Array<Suggestion> }
export class PopularSuggestions extends React.Component<any, PopularSuggestionsState>
{
    render()
    {
        return (
    <Row>        
        <section className="item-section">
            <div className="item-container">
        <h2>Populære forslag</h2>			
            <div className="item-holder">
                <article className="item-wrapp">
                    <div className="item">
                        <a href="#" className="img-block">
                            <img src="images/img-2.jpg" width="298" height="200" alt="image description"/>
                        </a>
                    <div className="item-content">
                        <h3><a href="#">Kommunale dyrkekasser</a></h3>
                        <div className="text-block same-height-left">
                            <p>Plassen bak blokka er ikke i bruk. Kanskje den kunne brukes som et uteområde for barna i nabolaget? Det vil skape samhold og spre glede for områdets unge beboere.</p>
                        </div>
                        <footer>
                            <time>25.01.2017</time>
                            <strong className="author">Joe Cooper</strong>
                            <span>Asker</span>
                        </footer>
                        <ul className="btn-list">
                            <li>
                                <a href="#"><i className="icon-like"></i><span className="counter">321</span></a>
                            </li>
                            <li>
                                <a href="#"><i className="icon-comments"></i><span className="counter">65</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className="item-wrapp">
                <div className="item">
                    <a href="#" className="img-block">
                        <img src="images/img-3.jpg" width="298" height="200" alt="image description"/>
                    </a>
                    <div className="item-content">
                        <h3><a href="#">Magisk turstibelysning</a></h3>
                        <div className="text-block">
                            <p>Det er mange trestubber igjen i hogstfeltet bak skolen. Disse kan brukes til å lage “magisk” turbelysning langs områdets turstier</p>
                        </div>
                        <footer>
                            <time >25.01.2017</time>
                            <strong className="author">Johanne Frederiksen</strong>
                            <span>Heggedal</span>
                        </footer>
                        <ul className="btn-list">
                            <li>
                                <a href="#"><i className="icon-like"></i><span className="counter">1.748</span></a>
                            </li>
                            <li>
                                <a href="#"><i className="icon-comments"></i><span className="counter">15</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className="item-wrapp">
                <div className="item">
                    <a href="#" className="img-block">
                        <img src="images/img-4.jpg" width="298" height="200" alt="image description"/>
                    </a>
                    <div className="item-content">
                        <h3><a href="#">La sykkelstien leve!</a></h3>
                        <div className="text-block">
                            <p>Hva med å lage sykkelsti av stien som går mellom A og B? Føles bortkastet å la dette område bare gro igjen. </p>
                        </div>
                        <footer>
                            <time>16.10.2016</time>
                            <strong className="author">Thomas Johansen</strong>
                            <span>Asker</span>
                        </footer>
                        <ul className="btn-list">
                            <li>
                                <a href="#"><i className="icon-like"></i><span className="counter">98</span></a>
                            </li>
                            <li>
                                <a href="#"><i className="icon-comments"></i><span className="counter">125</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
        </div>
        <a href="#" className="btn">Vis flere populære forslag</a>    
        </div>
</section>
</Row>)
    }
}