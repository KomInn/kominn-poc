import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class Map extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <div id="wrapper">
                    <time datetime="2017-01-25">25.01.2017</time>
                    <strong class="author">Joe Cooper</strong>
                    <address>
                            Nylandsveien 1187<br>
                            0181, Oslo
                    </address>
                    <span class="type-frame">Nyttetype: “type”</span>
                    <div class="map-block hidden-xs">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4000.47345914212!2d10.751224881818182!3d59.91161845259555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e61f267f039%3A0x7e92605fd3231e9a!2z0J7RgdC70L4sINCd0L7RgNCy0LXQs9C40Y8!5e0!3m2!1sru!2s!4v1488360674717" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
                    </div>
                </div>                 
            </Row>                    
        )
    }
}