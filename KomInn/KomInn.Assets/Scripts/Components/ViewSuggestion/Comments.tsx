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
                <div id="wrapper">
                    <form action="#" class="comments-form">
                        <label for="kommentarer">Kommentarer</label>
                        <textarea id="kommentarer" cols="30" rows="10" placeholder="Hva syntes du om forslaget?"></textarea>
                        <button type="submit" class="btn">Post kommentarer</button>
                    </form>
                    <ul class="comments-list">
                        <li>
                            <div class="img-block">
                                <div class="img-wrapp">
                                    <img src="images/img-8.jpg" width="80" height="80" alt="image description">
                                </div>
                            </div>
                            <div class="text-block">
                                <strong class="title">Erik Disneyland - <time datetime="2017-04-25">25.04.2017</time></strong>
                                <div class="comment-area">
                                    <div class="text-wrapp">
                                        <p>Jeg bor selv i området, og jeg elsker dette forslaget. Dette håper jeg virkelig dere satser på. Det er altfor få uteområder for barna i nabolaget</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="img-block">
                                <div class="img-wrapp">
                                    <img src="images/img-8.jpg" width="80" height="80" alt="image description">
                                </div>
                            </div>
                            <div class="text-block">
                                <strong class="title">Erik Disneyland - <time datetime="2017-04-25">25.04.2017</time></strong>
                                <div class="comment-area">
                                    <div class="text-wrapp">
                                        <p>Jeg bor selv i området, og jeg elsker dette forslaget. Dette håper jeg virkelig dere satser på. Det er altfor få uteområder for barna i nabolaget</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>                 
            </Row>                    
        )
    }
}