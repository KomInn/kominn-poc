import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Suggestion } from "../Common/Suggestion";
import { DataAdapter } from "../Common/DataAdapter";
import { Status } from "../Common/Status";
import * as vis from "vis"; 


interface InspiredByProps { suggestion:Suggestion }
interface InspiredByState { InspiredBy:Array<Suggestion>, InspirationFor:Array<Suggestion>, selectedLocation:google.maps.LatLng   }
enum PinTypes { Start, After, Previous }
export class InspiredBy extends React.Component<InspiredByProps, InspiredByState>
{

    marker:google.maps.Marker;
    map:google.maps.Map; 
    constructor()
    {
        super(); 
        this.state ={ InspiredBy:new Array<Suggestion>(), InspirationFor:new Array<Suggestion>(), selectedLocation:new google.maps.LatLng(59.8346001,10.436568699999953) };         
         this.map = null;
        this.marker = null; 
    }

    componentWillMount()
    {
      
    }
    componentWillReceiveProps(newprops:InspiredByProps)
    {
      
    }

/**
 * 
 * @param which 1 = green, 2 = yellow, 3 = red
 */
    getPin(which:PinTypes)
    {
        switch(which)
        {
            case PinTypes.Start: return 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png';
            case PinTypes.Previous: return 'http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png';
            case PinTypes.After: return 'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png'
        }
    }
    
    getPinIcon(which:PinTypes):any
    {        
        return {
        url: this.getPin(which),
        scaledSize : new google.maps.Size(32, 32)
        };     
    }

    drawMap()
    {   
       var startPin = {
        url: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png', // image is 512 x 512
        scaledSize : new google.maps.Size(32, 32)
    };     
    
    
        var myOptions = {
            zoom: 5,
            center: this.state.selectedLocation,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById("map"), myOptions); 

      google.maps.event.addListener(this.map, 'click', ((event:any) => {	         
         this.setMarker(event.latLng);
      }));
    }
    setMarker(location:google.maps.LatLng)
    {       
        if (this.marker) {
            this.marker.setPosition(location);
            return; 
         }
         var infowindow = new google.maps.InfoWindow({
    content: "<h1>Skole må testes</h1><div id='bodyContent'><p>DEtte er en test</p></div>"
  })

 
  
	     this.marker = new google.maps.Marker({
             position:location, 
             map:this.map,             
             icon: this.getPinIcon(PinTypes.After),
             animation: google.maps.Animation.DROP, }); 
            this.marker.addListener('click', () => infowindow.open(this.map, this.marker)); 
         this.setState({selectedLocation:location});
    }

    
    componentDidMount()
    {
        console.log(this.props);
        var da = new DataAdapter();         
        da.getAllSuggestions(null,2500, "&$filter=Status ne 'Sendt inn'&$select=Id,Title,InspiredBy/Id, InspiredBy/Title&$expand=InspiredBy")
            .then( (results:Array<Suggestion>) => { 
                console.log(results);                                   
                this.drawMap();
            })
           
    }

    render()
    {        
        return (
            <Row>                
                <div className="text-area">
                    <h3>Forbindelse til andre forslag</h3>
                    <p>Visualiseringen nedefor viser hvordan dette forslaget både har blitt inspirert av andre, tidligere, forslag samtidig som det igjen har inspirert ny forslag.</p>
                </div>
                <div className="img-area">
                    <div id="map" style={{width:"500px", height:"300px"}}></div>
                </div>
                <div className="btn-holder hidden-xs">
                    <a href="#" className="btn-link">Tidligere forslag</a>
                    <a href="#" className="btn-link">Senere forslag</a>
                </div>
            </Row>                    
        )
    }
}