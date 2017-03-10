import * as React from "react";
import { Row, Col } from "react-bootstrap";

interface CommentsBarProperties { onSuggestionSelected?():void }
interface CommentsBarState {  }
export class Comments extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <form action="#" className="comments-form">
                    <label htmlFor="kommentarer">Kommentarer</label>
                    <textarea id="kommentarer" cols={30} rows={10} placeholder="Hva syntes du om forslaget?"></textarea>
                    <button type="submit" className="btn">Post kommentarer</button>
                </form>
                <ul className="comments-list">
                    <li>
                        <div className="img-block">
                            <div className="img-wrapp">
                                <img src="images/img-8.jpg" width="80" height="80" alt="image description"/>
                            </div>
                        </div>
                        <div className="text-block">
                            <strong className="title">Erik Disneyland - <time >25.04.2017</time></strong>
                            <div className="comment-area">
                                <div className="text-wrapp">
                                    <p>Jeg bor selv i området, og jeg elsker dette forslaget. Dette håper jeg virkelig dere satser på. Det er altfor få uteområder for barna i nabolaget</p>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="img-block">
                            <div className="img-wrapp">
                                <img src="images/img-8.jpg" width="80" height="80" alt="image description"/>
                            </div>
                        </div>
                        <div className="text-block">
                            <strong className="title">Erik Disneyland - <time >25.04.2017</time></strong>
                            <div className="comment-area">
                                <div className="text-wrapp">
                                    <p>Jeg bor selv i området, og jeg elsker dette forslaget. Dette håper jeg virkelig dere satser på. Det er altfor få uteområder for barna i nabolaget</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </Row>                    
        )
    }
}