import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion"; 

interface InspiredByProps { onDataUpdate?(inspiredBy:Array<Suggestion>):void }
interface InspiredByState { inspiredBy:Array<Suggestion> }
export class InspiredBy extends React.Component<InspiredByProps, InspiredByState>
{
    render()
    {
        return (
<Row>                 
    <Col xs={12}>        
    <div className="form-area">
        <label htmlFor="inspirasjon">Inspirasjon(valgfritt)</label>
        <input id="inspirasjon" type="text" placeholder="Ble du inspirert av andre forslag?" />
        <div className="offers-table alt">
            <div className="table-row">
                <div className="col">
                    <a href="#" className="title-block">
                        <div className="img-block">
                            <img src="images/placeholder-1.jpg" width="49" height="49" alt="image description" />
                        </div>
                        <strong className="table-title">Bygg en lekeplass for barna</strong>
                    </a>
                </div>
                <div className="col">
                    <a href="#" className="btn-close"><span className="hidden">X</span></a>
                </div>
            </div>
            <div className="table-row">
                <div className="col">
                    <a href="#" className="title-block">
                        <div className="img-block">
                            <img src="images/placeholder-1.jpg" width="49" height="49" alt="image description" />
                        </div>
                        <strong className="table-title">Hva med utendørs buldrevegg på Festningen?</strong>
                    </a>
                </div>
                <div className="col">
                    <a href="#" className="btn-close"><span className="hidden">X</span></a>
                </div>
            </div>
        </div>
    </div>  
    </Col>
</Row>                    
        )
    }
}