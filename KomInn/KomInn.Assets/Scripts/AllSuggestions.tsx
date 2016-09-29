// Structure tree
/*
    AllSuggestions
        - NewSuggestionButton
        - SuggestionList
            - CarouselViewItem
            - CarouselItem
*/

import * as React from "react";
import * as $ from "jquery";
import { ListData, Suggestion, Suggestions, SuggestionType  } from "./SPTools"


export class AllSuggestions extends React.Component<void, SuggestionListState>
{
    render()
    {
        
        return (<div>  
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
                </div>);
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
        return (<div className="btn-success btn-lg" onClick={this.redirectToNewSuggestion}>
                    Send inn ditt forslag!
                </div>)
    }

}

interface SuggestionListProps { Type:SuggestionType, Title:string }
interface SuggestionListState { partitions?:Array<Array<Suggestion>>, windowWidth?:number, suggestions?:Array<Suggestion> }
class SuggestionList extends React.Component<SuggestionListProps, SuggestionListState>
{         
    id:string;  
    constructor()
    {
        super();
        this.id = SP.Guid.newGuid().toString();        
        this.state = { partitions:new Array<Array<Suggestion>>(),
                       windowWidth:window.innerWidth, 
                       suggestions:new Array<Suggestion>() };        
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillMount() 
    {
        var CAMLQuery = "<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><Neq><FieldRef Name='ForslagStatus'  /><Value Type='Text'>Realisert</Value></Neq></Where></Query></View>";
         
        if(this.props.Type == SuggestionType.SuccessStories)
            CAMLQuery = "<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><Eq><FieldRef Name='ForslagStatus'  /><Value Type='Text'>Realisert</Value></Eq></Where></Query></View>";


 
        Suggestions.GetByQuery(CAMLQuery)
            .done( ((result:Array<Suggestion>) => 
            {               
              
                
                this.setState({suggestions:result});    
                Suggestions.partitionSuggestions(result, 4)
                .done( ((computedPartitions:Array<Array<Suggestion>>) =>    
                {                   
                    this.setState({partitions:computedPartitions});
                }).bind(this));

        }).bind(this));
    }

 
  handleResize()
  {
      this.setState({windowWidth:window.innerWidth});    

      if(this.state.suggestions.length <= 0)
        return; 

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

        
     Suggestions.partitionSuggestions(this.state.suggestions, parts)
    .done( ((computedPartitions:Array<Array<Suggestion>>) =>    
    {
        this.setState({partitions:computedPartitions});
    }).bind(this));
    

    
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
        if(this.state.suggestions.length <= 3)
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
        if(this.state.suggestions.length <= 0)
            return <div></div>;

    return (   

        <div>
            <h1>{this.props.Title}</h1>              
            <div id={this.id} className="carousel slide" data-interval="false">   
                <div className="carousel-inner">
                    {this.state.partitions.map((item, index) => {                   
                        return <CarouselViewItem suggestions={item} index={index} />
                    })}
                </div>
                {this.renderIndicators()}
            </div>    
        </div> ); 
    }
}

interface CarouselViewProps { suggestions:Array<Suggestion>, index:number }
class CarouselViewItem extends React.Component<CarouselViewProps, {}>{
    render()
    {      
      
        var active = (this.props.index == 0) ? "active" : "";       
        return(
            <div className={`item ${active}`}>
                        <div className="row">
                            {this.props.suggestions.map((item, index) => 
                            {                               
                                return <CarouselItem suggestion={item} />
                            })
                        }
                        </div>          
                    </div>
        );
    }
}


interface CarouselItemProps { suggestion:Suggestion }
class CarouselItem extends React.Component<CarouselItemProps, {}> 
{
    renderTags()
    {        
        if(this.props.suggestion.ForslagType.Id.length <= 0)
            return;

         return (
             <span className="iconspace">
                    <span className="icon glyphicon glyphicon-tag"></span>{this.props.suggestion.ForslagType.Title}
            </span>
         );

    }

    renderLikes()
    {        
        if(this.props.suggestion.Likes == null)
            return; 

        return (
            <span className="iconspace"> 
                <span className="icon glyphicon glyphicon-thumbs-up"></span>{this.props.suggestion.Likes}
            </span>
        );          
    }

    renderComments() {           
        if(this.props.suggestion.AntallKommentarer <= 0 || this.props.suggestion.AntallKommentarer == undefined)
            return; 

        return (<span className="iconspace"><span className="icon glyphicon glyphicon-comment iconspace"></span>{this.props.suggestion.AntallKommentarer}</span>)
    }
    
    redirect()
    {
        window.location.href = "Forslag.aspx?ref="+this.props.suggestion.Id; 
    }

    render()
    {              
       var fullWidth = (window.innerWidth < 544) ? "fullwidth" : ""
        return (        
         <div className={`col-sm-4 col-xs-6 col-md-4 col-lg-3 ${fullWidth}`} >
            <section className={`ki-shadow-box-item ${fullWidth}`}>
                <article className="carousel-item kiGradient clickable" onClick={this.redirect.bind(this)}>
                    <header>{this.props.suggestion.Utfordring}</header>
                        <main className="">                                                        
                            <p>{this.props.suggestion.ForslagTilLosning}</p>
                        </main>
                    <footer>
                        {this.renderLikes()}
                        {this.renderComments()}                
                        {this.renderTags()}
                            <div className="dateperson">
                                <span className="glyphicon glyphicon-calendar"></span>{this.props.suggestion.Created} 
                                <span className="glyphicon glyphicon-user iconspace"></span>{this.props.suggestion.Navn.DisplayName}
                            </div>
                    </footer>
                </article>
            </section>
        </div>)
    }
}