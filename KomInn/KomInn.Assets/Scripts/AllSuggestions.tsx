import * as React from "react";
import * as $ from "jquery";
import * as SPTools from "./SPTools"

export interface Forslag {
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
    AntallKommentarer?:string;
    Id?:string;
}
enum SuggestionType { "Submitted", "SuccessStories" };
export class AllSuggestions extends React.Component<void, SuggestionListState>
{
    componentHasMounted()
    {
        var ld = new SPTools.ListData();
        ld.getDataFromList("Forslag", "").done( (d:any) => {
           // console.log(d);
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
                            <SuggestionList Type={SuggestionType.Submitted}  Title="Mottatte forslag" />             
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                           
                            <SuggestionList Type={SuggestionType.SuccessStories} Title="Suksesshistorier" />
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

interface Suggestion { Type:SuggestionType, Title:string }
interface SuggestionListState { partitions?:Array<Array<Forslag>>, windowWidth?:number, suggestions?:Array<Forslag> }
class SuggestionList extends React.Component<Suggestion, SuggestionListState>
{         
    id:string;
    numSuggestions:number;
    constructor()
    {
        super();
        this.id = SP.Guid.newGuid().toString();        
        this.state = { partitions:new Array<Array<Forslag>>(), windowWidth:window.innerWidth, suggestions:new Array<Forslag>() };
        this.numSuggestions = 0;
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillMount() 
    {
        var odataFilter = "&$filter=ForslagStatus ne 'Realisert'"; 
        if(this.props.Type == SuggestionType.SuccessStories)
            odataFilter = "&$filter=ForslagStatus eq 'Realisert'";
        var sArr = new Array<Forslag>();
        var listData = new SPTools.ListData();
        listData.getDataFromList("Forslag", "?$select=ID,Utfordring,Likes,ForslagStatus,Forslag_x0020_til_x0020_l_x00f8_,Created,Tags,Navn/Title&$expand=Navn&$orderby=Created desc" + odataFilter )        
        .done( ((e:any) => { 
                this.numSuggestions  = e.d.results.length; 
                if(this.numSuggestions <= 0)
                    return;

             
                for(let item of e.d.results)
                {
                sArr.push(
                    {ForslagTilLosning:item.Forslag_x0020_til_x0020_l_x00f8_,
                     Created:this.formatDate(item.Created),
                     Utfordring:item.Utfordring, 
                    Likes:item.Likes, 
                    Navn:item.Navn.Title,
                    AntallKommentarer:"0",
                Tags:"Fag"});
                }
                this.setState({suggestions:sArr});
                this.partitionSuggestions(sArr, 4);               
        }).bind(this))
        .fail( (e:any) => { console.log(e); });
    }

  partitionSuggestions(forslag:Array<Forslag>, partitionSize:number)
  {
         var p = Array<Array<Forslag>>();
         var partition = new Array<Forslag>();         
         for(var i=0;i<forslag.length;i++)
         {            
            partition.push(forslag[i]);             
            if(partition.length == partitionSize)
            {                
                p.push(partition);
                partition = new Array<Forslag>();
            }
         }    
         if(partition.length > 0)    
            p.push(partition);

         this.setState({partitions:p});
         
  }

  handleResize()
  {
      this.setState({windowWidth:window.innerWidth});     
      var width = this.state.windowWidth; 
      var parts = 4;
      if(width <= 544) // xs
            parts = 1;   
      else if(width >= 544 && width < 768  ) // sm
        parts = 2;
        else if(width >= 768 && width < 992)
            parts = 3;
      else if(width >= 992 && width < 1200) // md
            parts = 3;
        else if(width >= 1200) // lg
            parts = 4;

    this.partitionSuggestions(this.state.suggestions, parts);
  }

    formatDate(netdate:string):string
    {
        var year = netdate.substr(0,4);
        var month = netdate.substr(5,2);
        var day = netdate.substr(8,2);
        return day + "." + month + "." + year;
    }

    renderIndicators()
    {        
        if(this.numSuggestions <= 3)
            return <div></div>;

        return ( <div className="carousel-indicators-wrap" >
                    <a className="carousel-control left glyphicon glyphicon-chevron-left " href={'#'+this.id} data-slide="prev"></a>
                    <ol className="carousel-indicators">
                        {this.state.partitions.map((item, index) => {
                            var active = (index == 0) ? "active" : "";

                            return <li data-target={'#'+this.id} data-slide-to={index} className={active}></li>
                        })}                        
                    </ol> 
                    <a className="carousel-control right glyphicon glyphicon-chevron-right" href={'#'+this.id} data-slide="next"></a>
                </div>);
    } 
    
    render() {   
        
        if(this.numSuggestions <= 0)
            return <div></div>;

console.log("RENDERING!");
        console.log(this.state);

    return (        
        <div>
            <h1>{this.props.Title}</h1>              
            <div id={this.id} className="carousel slide" data-interval="false">   
                <div className="carousel-inner">
                    {this.state.partitions.map((item, index) => {                   
                        return <CarouselViewItem forslag={item} index={index} />
                    })}
                </div>
                {this.renderIndicators()}
            </div>    
        </div> ); 
    }
}

interface CarouselViewProps { forslag:Array<Forslag>, index:number }
class CarouselViewItem extends React.Component<CarouselViewProps, {}>{
    render()
    {      
        var active = (this.props.index == 0) ? "active" : "";
        console.log(this.props.index);
        return(
            <div className={`item ${active}`}>
                        <div className="row">
                            {this.props.forslag.map((item, index) => 
                            {                               
                                return <CarouselItem forslag={item} />
                            })
                        }
                        </div>          
                    </div>
        );
    }
}


interface CarouselItemProps { forslag:Forslag }
class CarouselItem extends React.Component<CarouselItemProps, {}> 
{
    renderTags()
    {
        if(this.props.forslag.Tags == null)
         return;

         

         return (
             <span>
                    <span className="icon glyphicon glyphicon-tag iconspace"></span>{this.props.forslag.Tags}
            </span>
         );

    }

    renderLikes()
    {
        if(this.props.forslag.Likes == null)
            return; 

        return (
            <span> 
                <span className="icon glyphicon glyphicon-thumbs-up"></span>{this.props.forslag.Likes}
            </span>
        );
         
    }
    

    render()
    {       
       var fullWidth = (window.innerWidth < 544) ? "fullwidth" : ""
        return (
         <div className={`col-sm-4 col-xs-6 col-md-4 col-lg-3 ${fullWidth}`}>
            <section className={`ki-shadow-box-item ${fullWidth}`}>
                <article className="carousel-item kiGradient">
                    <header>{this.props.forslag.Utfordring}</header>
                        <main className="">                                                        
                            <p>{this.props.forslag.ForslagTilLosning}</p>
                        </main>
                    <footer>
                        <span className="icon glyphicon glyphicon-thumbs-up"></span>{this.props.forslag.Likes} 
                        <span className="icon glyphicon glyphicon-comment iconspace"></span>{this.props.forslag.AntallKommentarer}                
                        {this.renderTags()}
                            <div className="dateperson">
                                <span className="glyphicon glyphicon-calendar"></span>{this.props.forslag.Created} 
                                <span className="glyphicon glyphicon-user iconspace"></span>{this.props.forslag.Navn}
                            </div>
                    </footer>
                </article>
            </section>
        </div>)
    }
}