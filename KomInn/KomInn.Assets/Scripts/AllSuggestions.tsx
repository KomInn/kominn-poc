import * as React from "react";
import * as $ from "jquery";
import * as SPTools from "./SPTools"

interface Forslag {
    Adresse?:string; 
    Avdeling?:string;
    Created:string;
    Epostadresse?:string;
    ForslagTilLosning?:string; 
    ForslagStatus?:string;
    Kommune?:string;
    Kommunenummer?:string; 
    Konkurransereferanse?:string; 
    Likes?:string; 
    Modified?:string; 
    NarmesteLeder?:string; 
    Navn?:string; 
    NyttigForAndre?:string; 
    Postnummer?:string; 
    Saksbehandler?:string; 
    Tags?:string; 
    Telefon?:string; 
    Utfordring?:string; 
    Virksomhet?:string;
    CreatedBy?:string; 
    ModifiedBy?:string; 
}
enum SuggestionType { "Submitted", "SuccessStories" };
interface SuggestionListState { forslag:Array<Forslag> }

export class AllSuggestions extends React.Component<void, SuggestionListState>
{
    componentHasMounted()
    {
        var ld = new SPTools.ListData();
        ld.getDataFromList("Forslag", "").done( (d:any) => {
            console.log(d);
        });
        
    }

    render()
    {
        
        return <div>  
                    <div className="row">      
                        <div className="col-xs-2">
                            <h1>KomInn</h1>                            
                        </div>
                        <div className="col-xs-4">
                            <NewSuggestionButton />
                        </div>        
                        <div className="col-xs-6">
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <p>KomInn er en kommunal forslagsportal der du kan foreslå forbedringer og skape nye ideer.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Alle forslag</h1>
                            <SuggestionList Type={SuggestionType.Submitted}  />             
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Suksesshistorier</h1>
                            <SuggestionList Type={SuggestionType.SuccessStories} />
                        </div>
                    </div>       
                </div>
    }
}

class NewSuggestionButton extends React.Component<void, {}>
{

    redirectToNewSuggestion()
    {
        window.location.href = "./NyttForslag.aspx";
    }
    render()
    {
        return <div className="btn-success btn-lg" onClick={this.redirectToNewSuggestion}>
                    Send inn ditt forslag!
                </div>
    }

}

interface Suggestion { Type:SuggestionType,  }

class SuggestionList extends React.Component<Suggestion, {}>
{
    id:string;
    constructor()
    {
        super();
        this.id = SP.Guid.newGuid().toString();



    }
    render() { 
        
        
        return <div>
            <div id={this.id} className="carousel slide">
   
    <div className="carousel-inner">
        <div className="item active">
            <div className="row">
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_squid.jpg" alt="Image" className="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cuttlefish.jpg" alt="Image" className="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cleaned_squid.jpg" alt="Image" className="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cleaned_octopus.jpg" alt="Image" className="img-responsive" /></a>
                </div>
                    <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cleaned_cuttlefish.jpg" alt="Image" className="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/reef_cod.jpg" alt="Image" className="img-responsive" /></a>
                </div>
            </div>
          
        </div>
       
        <div className="item">
            <div className="row">
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/leather_jacktfish.jpg" alt="Image" class="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/ribbonfish.jpg" alt="Image" class="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/croaker1.jpg" alt="Image" class="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/shrimp_black_tiger.jpg" alt="Image" class="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cuttlefish.jpg" alt="Image" class="img-responsive" /></a>
                </div>
                <div className="col-sm-2 col-xs-6"><a href="#x"><img src="images/whole_cleaned_squid.jpg" alt="Image" class="img-responsive" /></a>
                </div>
            </div> 
          
        </div> 
       
    </div>
    <div className="row"   >
        <div className="col-xs-12 carousel-control-wrapper "  >
            <div className="col-xs-3"></div>
            <div className="col-xs-3">
            <a className="left carousel-control" href={'#'+this.id} data-slide="prev"><i className="fa ta fa-chevron-left fa-4"></i></a>
            </div>
            <div className="col-xs-3">
            <a className="right carousel-control" href={'#'+this.id} data-slide="next"><i className="fa fa-chevron-right fa-4"></i></a>
            </div>
            <div className="col-xs-3"></div>
        </div>
    </div>
</div>    
            </div> }
}

