import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class Content extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <section className="item-section">
                    <div className="item-container">
                        <h2>Lekeplass / uteområde for barna</h2>
                        <div className="img-frame">
                            <img src="images/img-6.png" width="531" height="299" alt="image description"/   >
                        </div>
                    </div>  
                </section>               
            </Row>                    
        )
    }
}
