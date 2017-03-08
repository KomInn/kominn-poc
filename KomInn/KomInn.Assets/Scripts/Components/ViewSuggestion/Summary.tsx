import * as React from "react";
import { Row, Col } from "react-bootstrap";

export class Summary extends React.Component<any, any>
{
    render()
    {
        return (
            <Row>                
                <section className="item-section">
                    <div className="item-holder">
                        <div className="text-area">
                            <h3>Sammendrag</h3>
                            <p>Plassen bak blokka er ikke i bruk. Kanskje den kunne brukes som et uteområde for barna i nabolaget? Det vil skape samhold og spre glede for områdets unge beboere.</p>
                        </div>
                    </div> 
                    <div className="item-holder">
                        <div className="text-area">
                            <h3>Utfordringer</h3>
                            <p>Foruten penger er det vanskelig å komme til med anleggsmaskiner. For at dette skal bli fint må området først planeres. Jeg er ikke en fagperson innen bygg og anlegg, men jeg tror dette vil kreve omfattende strukturelle endringer i bakgården</p>
                        </div>
                    </div> 
                    <div className="item-holder">
                        <div className="text-area">
                            <h3>Løsningsforslag</h3>
                            <p>Dersom vi åpner for at inngangen til lekeplassen kunne vært fra nordsiden istedenfor dagens sørside, kunne man kommet lettere til. Ved å argumentere for verdien dette skaper for beboere i nabolaget vil man lettere kunne søke om midler</p>
                        </div>
                    </div> 
                </section>                
            </Row>                    
        )
    }
}