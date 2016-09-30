
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
import { ListData, Suggestion, Suggestions, SuggestionType, SuggestionViewDisplayMode, ITaxonomyTerm, SortTypes, Taxonomy  } from "./SPTools"


interface ShowAllButtonState { DisplayMode:SuggestionViewDisplayMode }
interface ShowAllButtonProps { OnClickHandler():void, DisplayMode:SuggestionViewDisplayMode }
class ShowAllButton extends React.Component<ShowAllButtonProps, ShowAllButtonState> {
    
    constructor() {
        super();
        this.state  = { DisplayMode:SuggestionViewDisplayMode.Brief }
    }
    componentWillMount()
    {
        
        this.setState({DisplayMode:this.props.DisplayMode});
    }

    buttonClicked(evt:any)
    {
        this.props.OnClickHandler();
        this.setState({DisplayMode:this.state.DisplayMode == SuggestionViewDisplayMode.Brief ? SuggestionViewDisplayMode.Detailed : SuggestionViewDisplayMode.Brief }); 
    }

    render()
    {
        var buttonText = this.state.DisplayMode == SuggestionViewDisplayMode.Brief ? "Vis alle" : "Vis færre";
        return  (<div className="text-right button"><div className="btn-lg btn btn-success" onClick={this.buttonClicked.bind(this)}>{buttonText}</div></div>)
    }
}

interface AllSuggestionsState { DisplayModeAll?:SuggestionViewDisplayMode, DisplayModeSuccess?:SuggestionViewDisplayMode }
export class AllSuggestions extends React.Component<void, AllSuggestionsState>
{
    constructor()
    {
        super();
        this.state = { DisplayModeAll:SuggestionViewDisplayMode.Brief }
    }
    changeDisplayModeAll()
    {
        this.setState({DisplayModeAll:(this.state.DisplayModeAll == SuggestionViewDisplayMode.Brief) ?  SuggestionViewDisplayMode.Detailed : SuggestionViewDisplayMode.Brief });
    }
   
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
                    <SuggestionList Title="Mottatte forslag" InitialDisplayMode={SuggestionViewDisplayMode.Brief} Type={SuggestionType.Submitted} />
                    <SuggestionList Title="Suksesshistorier" InitialDisplayMode={SuggestionViewDisplayMode.Brief} Type={SuggestionType.SuccessStories} />
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

export interface SuggestionListProps { Type:SuggestionType, InitialDisplayMode:SuggestionViewDisplayMode, Title:string }
export interface SuggestionListState { 
    partitions?:Array<Array<Suggestion>>, 
    windowWidth?:number, 
    suggestions?:Array<Suggestion>, 
    ShowFullWidthItem?:boolean, 
    filters?:Array<ITaxonomyTerm>, 
    selectedSort?:SortTypes,
    selectedFilter?:string,
    DisplayMode?:SuggestionViewDisplayMode
}
export class SuggestionList extends React.Component<SuggestionListProps, SuggestionListState>
{         
    id:string;  
    constructor()
    {
        super();
        this.id = SP.Guid.newGuid().toString();        
        this.state = { partitions:new Array<Array<Suggestion>>(),
                       windowWidth:window.innerWidth, 
                       suggestions:new Array<Suggestion>(),
                    ShowFullWidthItem:false,
                filters:new Array<ITaxonomyTerm>(),
               selectedSort:SortTypes.Newest, 
            selectedFilter:null,
        DisplayMode:SuggestionViewDisplayMode.Brief };
                
    }

    componentWillMount() 
    {
        this.setState({DisplayMode:this.props.InitialDisplayMode});        
         window.addEventListener('resize', this.handleResize.bind(this));
         this.loadSuggestions();         
         Taxonomy.GetTaxonomyArray("ForslagType", 1033).done( ((result:Array<ITaxonomyTerm>) => {
            this.setState({filters:result});
         }).bind(this))
    }

    loadSuggestions()
    {
        var eqc = (this.props.Type == SuggestionType.SuccessStories ) ? "Eq" : "Neq";
         var filterand = ""; 
         var filtercaml = ""; 
         var filterandclose = "";

         if(this.state.selectedFilter != null && this.state.selectedFilter != "")
         {
            filterand = "<And>"; 
            filterandclose = "</And>"
            filtercaml = "<Eq><FieldRef Name='ForslagType' /><Value Type='Text'>"+this.state.selectedFilter+"</Value></Eq>";

         } 
          var CAMLQuery = 
            `<View><Query>
                    <OrderBy>
                        <FieldRef Name='${this.mapSortFieldToType(this.state.selectedSort)}' Ascending='${ (this.state.selectedSort == SortTypes.Oldest ? "TRUE" : "FALSE" ) }' />
                    </OrderBy>
                    <Where>
                    ${filterand}
                        <${eqc}>
                            <FieldRef Name='ForslagStatus'  /><Value Type='Text'>Realisert</Value>
                        </${eqc}>                   
                        ${filtercaml}
                    ${filterandclose}</Where></Query></View>`;  
       


             Suggestions.GetByQuery(CAMLQuery)
            .done( ((result:Array<Suggestion>) => 
            {
                console.log("result");
                console.log(result);
                this.setState({suggestions:result});   
                
                var numPartitions = 
                    (this.detailedMode()) ? 100 : 4;                    

                Suggestions.partitionSuggestions(result, numPartitions)
                .done( ((computedPartitions:Array<Array<Suggestion>>) =>    
                {                   
                    this.setState({partitions:computedPartitions});
                    this.handleResize();
                }).bind(this));

        }).bind(this));
    }

    mapSortFieldToType(sortType:SortTypes):string
    {
        switch(sortType)
        {
            case SortTypes.Oldest : 
            case SortTypes.Newest : return "Created";
            case SortTypes.Likes : return "Likes"; 
            case SortTypes.Comments : return "AntallKommentarer";             
            default : return "Created";            
        }        
    }


 
  handleResize()
  {
      this.setState({windowWidth:window.innerWidth}, (() => {
      var width = this.state.windowWidth; 
      var parts = 4;
      if(width <= 544) // xs
      {        
          this.setState({ShowFullWidthItem:true});  
            parts = 1;   
      }      
      else if(width >= 544 && width < 768  ) // sm      
      {
          if(this.detailedMode())
            this.setState({ShowFullWidthItem:true});
 
        parts = 2;  
      }    
        else if(width >= 768 && width < 992)
            parts = 3;
      else if(width >= 992 && width < 1200) // md
            parts = 3;
        else if(width >= 1200) // lg
            parts = 4;
    
       if(width >= 768)
            this.setState({ShowFullWidthItem:false});      
        
        if(this.detailedMode())  
            parts = 100; 
    
     Suggestions.partitionSuggestions(this.state.suggestions, parts)
    .done( ((computedPartitions:Array<Array<Suggestion>>) =>    
    {
        this.setState({partitions:computedPartitions});
    }).bind(this));    

      }).bind(this));
  }

    detailedMode():boolean{
        return this.state.DisplayMode == SuggestionViewDisplayMode.Detailed;
    }

    renderIndicators()
    {   
        if(this.state.partitions.length <= 1)
            return <div></div> 

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

    changeDisplayMode() {
        this.setState({DisplayMode: (this.detailedMode()) ? SuggestionViewDisplayMode.Brief : SuggestionViewDisplayMode.Detailed}, ( () => {
            this.loadSuggestions();
        }).bind(this));
    }

    /* RENDER */ 
    render() {       
        if(this.state.suggestions.length <= 0)
            return (
                <div> 
                    {this.renderFilters()}
                </div>);


    return (
        <div>
        <div className="row">
            <div className="col-xs-6">
                <h1>{this.props.Title}</h1>
            </div>
            <div className="col-xs-6">
                 <ShowAllButton DisplayMode={this.state.DisplayMode}  OnClickHandler={this.changeDisplayMode.bind(this)} />
            </div>
        </div>
        <div className="row">
            <div className="col-xs-12">
                {this.renderFilters()}
                <div id={this.id} className="carousel slide" data-interval="false">   
                    <div className="carousel-inner">
                        {this.state.partitions.map((item, index) => {
                            if(this.detailedMode())
                            {
                                if(!this.filterMatch(item[index]))
                                    return <span></span>
                            }
                            return <CarouselViewItem suggestions={item} index={index} DisplayMode={this.state.DisplayMode} Fullwidth={this.state.ShowFullWidthItem} />
                        })}
                    </div>
                    {this.renderIndicators()}
                </div>   
            </div> 
        </div>
        </div> ); 
    }
    
    renderFilters()
    {
        if(!this.detailedMode())
            return (<span></span>);
        
        return (
            <div className="row">
            <div className="filters form-group">
                <div className="col-xs-4">
                    <span className="glyphicon glyphicon-filter"></span><strong>Filtrer </strong>
                    <select className="form-control" onChange={this.filterChange.bind(this)}>
                        <option value="" selected></option>
                        {this.state.filters.map( ((item:ITaxonomyTerm, index:number) => {
                         return <option value={item.Title}>{item.Title}</option>
                        }).bind(this))

                        }
                     
                    </select>
                </div>
                <div className="col-xs-4">
                    <span className="glyphicon glyphicon-sort"></span><strong>Sorter </strong>
                    <select className="form-control" onChange={this.sortChange.bind(this)}>
                        <option value={SortTypes.Newest} selected>Nyeste</option>
                        <option value={SortTypes.Oldest}>Eldste</option>
                        <option value={SortTypes.Comments}>Kommentarer</option>
                        <option value={SortTypes.Likes}>Likerklikk</option>
                    </select>
                </div>
            </div>
            </div>
        )
    }
    sortChange(event:any)
    {
        var selected = parseInt(event.target.value);
        this.setState({selectedSort:selected}, (() => this.loadSuggestions() ).bind(this));      
     
    }
    filterChange(event:any){
        var selected = event.target.value;
        this.setState({selectedFilter:selected}, (() => this.loadSuggestions() ).bind(this));                

    }

    filterMatch(item:Suggestion):boolean
    {
        if(this.state.selectedFilter == null || this.state.selectedFilter == "")
            return true; 

        if(item.ForslagType.Title == this.state.selectedFilter)
            return true; 

        return false;
    }
}

interface CarouselViewProps { suggestions:Array<Suggestion>, index:number, DisplayMode?:SuggestionViewDisplayMode, Fullwidth:boolean }
class CarouselViewItem extends React.Component<CarouselViewProps, {}>{
    render()
    {      
      
        var active = (this.props.index == 0) ? "active" : "";       
        return(
            <div className={`item ${active}`}>
                        <div className="row">
                            {this.props.suggestions.map((item, index) => 
                            {                               
                                return <CarouselItem suggestion={item} DisplayMode={this.props.DisplayMode} Fullwidth={this.props.Fullwidth} />
                            })
                        }
                        </div>          
                    </div>
        );
    }
}


interface CarouselItemProps { suggestion:Suggestion, DisplayMode?:SuggestionViewDisplayMode, Fullwidth:boolean }

class CarouselItem extends React.Component<CarouselItemProps, {}> 
{
    mapsApiKey:string; 
    id:string;    
    componentWillMount()
    {
        this.id = SP.Guid.newGuid().toString();
        this.mapsApiKey = "AIzaSyBm6VUBv0vOatSFO61u9Cn83L11d5qpu8A"; // DEVELOPER KEY, WILL BE INVALIDATED WITHOUT WARNING!

   
    }

    componentDidMount()
    {
    }
  
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

    getGMapsBGImage():any 
    {
        var addr = this.props.suggestion.Adresse;
        var pnr = this.props.suggestion.Postnummer; 
        if(addr == null && pnr == null)
            return {backgroundImage:"none"};

        if(pnr == null)
            pnr = "";

        pnr = ","+pnr; 

        var str = "https://maps.googleapis.com/maps/api/staticmap?center="+addr+pnr+"&zoom=13&size=245x206&maptype=roadmap&key="+this.mapsApiKey;

        return {backgroundImage:"url('"+str+"')"} 
    }

    render()
    {              
       var fullWidth = (this.props.Fullwidth) ? "fullwidth" : "";
       var bgImgUrl = this.getGMapsBGImage();

       var xsSize = (this.props.DisplayMode == SuggestionViewDisplayMode.Detailed) ? "col-xs-12" : "col-xs-6";
        return (        
         <div className={`col-sm-4 col-md-4 col-lg-3 ${xsSize}`} >
            <section className={`ki-shadow-box-item ${fullWidth}`} id={this.id} style={bgImgUrl} >
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