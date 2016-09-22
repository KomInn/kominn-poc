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
    AntallKommentarer?:string;
}
enum SuggestionType { "Submitted", "SuccessStories" };
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
interface SuggestionListState { partitions?:Array<Array<Forslag>> }
class SuggestionList extends React.Component<Suggestion, SuggestionListState>
{         
    id:string;
    numSuggestions:number;
    constructor()
    {
        super();
        this.id = SP.Guid.newGuid().toString();        
        this.state = { partitions:new Array<Array<Forslag>>() };
         
    }

    componentWillMount()
    {
        var odataFilter = ""; 
        if(this.props.Type == SuggestionType.SuccessStories)
            odataFilter = "&$filter=ForslagStatus eq 'Realisert'";
        var sArr = new Array<Forslag>();
        var listData = new SPTools.ListData();
        listData.getDataFromList("Forslag", "?$select=Utfordring,Likes,ForslagStatus,Forslag_x0020_til_x0020_l_x00f8_,Created,Tags,Navn/Title&$expand=Navn&$orderby=Created desc" + odataFilter )        
        .done( ((e:any) => { 
                this.numSuggestions  = e.d.results.length; 
                if(this.numSuggestions <= 0)
                    return;

                console.log(e);
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
                
                this.partitionSuggestions(sArr);
                console.log(this.state);
        }).bind(this))
        .fail( (e:any) => { console.log(e); });
    }


  partitionSuggestions(forslag:Array<Forslag>)
  {
         var p = Array<Array<Forslag>>();
         var partition = new Array<Forslag>();         
         for(var i=0;i<forslag.length;i++)
         {            
            partition.push(forslag[i]);             
            if(partition.length == 4)
            {                
                p.push(partition);
                partition = new Array<Forslag>();
            }
         }    
         if(partition.length > 0)    
         p.push(partition);

         this.setState({partitions:p});
         console.log(this.state);
         console.log(p);
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
                        <li data-target={'#'+this.id} data-slide-to="0" className="active"></li>                    
                        <li data-target={'#'+this.id} data-slide-to="1" className=""></li>
                    </ol>
                    <a className="carousel-control right glyphicon glyphicon-chevron-right" href={'#'+this.id} data-slide="next"></a>
                </div>);
    }
    
    render() {   

        if(this.numSuggestions <= 0)
            return <div></div>;

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
       
        return (
         <div className="col-sm-3 col-xs-6 ">
            <section className="ki-shadow-box-item">
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