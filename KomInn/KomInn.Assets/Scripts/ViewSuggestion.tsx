///<reference path="../typings/globals/sharepoint/index.d.ts" /> 
import * as React from "react";
import * as $ from "jquery";
import * as SPTools from "./SPTools"

interface SPUser {
    DisplayName?:string,
    LoginName?:string,
    Id?:number
}

interface SPTaxonomyTerm 
{
    Title?:string, 
    Id?:string
}

interface Forslag {
    Adresse?:string; 
    Avdeling?:string;
    Created?:string;
    Epostadresse?:string;
    ForslagTilLosning?:string; 
    ForslagStatus?:string;
    ForslagType?:SPTaxonomyTerm
    Kommune?:string;
    Kommunenummer?:string; 
    Konkurransereferanse?:string; 
    Likes?:number; 
    Modified?:string; 
    NarmesteLeder?:SPUser; 
    Navn?:SPUser; 
    NyttigForAndre?:string; 
    Postnummer?:string; 
    Saksbehandler?:SPUser; 
    Tags?:Array<SPTaxonomyTerm>; 
    Telefon?:string; 
    Utfordring?:string; 
    Virksomhet?:string;     
    ModifiedBy?:string; 
    AntallKommentarer?:string;
    Id:number;
    Attachments?:boolean
}

class ForslagTool
{
    GetById(Callback:any, Id:number)
    {
        this.GetAllItems(Callback, 
        "<View><Query><Where><Eq><FieldRef Name='ID'  /><Value Type='Number'>"+Id+"</Value></Eq></Where></Query></View>");
    }

    GetAllItems(Callback:any, CAMLQuery:string)//:JQueryPromise<Array<Forslag>>
    {
        var fArr = new Array<Forslag>();
        var query = new SP.CamlQuery();        
        query.set_viewXml(CAMLQuery);
        
        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle('Forslag');
        var items = oList.getItems(query);
        clientContext.load(items);
        clientContext.executeQueryAsync(function () {
        if (items.get_count() <= 0) {
            Callback(fArr);
            return;  
        }
        var enumerator = items.getEnumerator();        
        while (enumerator.moveNext()) 
        {
            var listItem = enumerator.get_current();
            let f:Forslag = { Id:listItem.get_item("ID") };
            
            f.Navn = { DisplayName:"", LoginName:"", Id:-1 };
            f.NarmesteLeder = { DisplayName:"", LoginName:"", Id:-1 };
            f.ForslagType = { Id:"", Title:"" };
            f.Tags = new Array<SPTaxonomyTerm>();
            // Navn SPUser
            let navnField:SP.FieldUserValue = listItem.get_item('Navn');
            if(navnField != null)
            {
                f.Navn = { DisplayName: navnField.get_lookupValue(), 
                        LoginName:"", 
                        Id:navnField.get_lookupId() };
            }
                    
            // Manager
            let managerField:SP.FieldUserValue = listItem.get_item("N_x00e6_rmeste_x0020_leder");
            if(managerField != null)
            {
                f.NarmesteLeder = {
                        DisplayName:managerField.get_lookupValue(),
                        LoginName:"",
                        Id:managerField.get_lookupId()
                    };
            }

            // ForslagType 
            let taxField:SP.Taxonomy.TaxonomyFieldValue = listItem.get_item("ForslagType");
            if(taxField != null)
            {
                f.ForslagType = {
                    Id:taxField.get_termGuid().toString(), 
                    Title:taxField.get_label()
                }
            }

            // Tags
            let tagsField:SP.Taxonomy.TaxonomyFieldValueCollection = listItem.get_item("Tags")
            if(tagsField != null)
            {
                f.Tags = Array<SPTaxonomyTerm>();
                var allTags = tagsField.getEnumerator();
                while(allTags.moveNext())
                {
                    var cItem = allTags.get_current(); 
                    
                    f.Tags.push({Id: cItem.get_termGuid().toString(), 
                                Title:cItem.get_label()});
                }
            }

            f.Adresse = listItem.get_item("Adresse");
            f.Attachments = listItem.get_item("Attachments");
            f.Avdeling = listItem.get_item("Avdeling");
            f.Created = listItem.get_item("Created"); 
            f.Epostadresse = listItem.get_item("E_x002d_postadresse");
            f.ForslagStatus = listItem.get_item("ForslagStatus");
            f.ForslagTilLosning = listItem.get_item("Forslag_x0020_til_x0020_l_x00f8_");
            f.Id = listItem.get_item("ID");
            f.Kommune = listItem.get_item("Kommune"); 
            f.Kommunenummer = listItem.get_item("Kommunenummer");
            f.Konkurransereferanse = listItem.get_item("Konkurransereferanse");
            f.Likes = listItem.get_item("Likes"); 
            f.NyttigForAndre = listItem.get_item("Nyttig_x0020_for_x0020_andre_x00");
            f.Postnummer = listItem.get_item("Postnummer"); 
            f.Telefon = listItem.get_item("Telefon"); 
            f.Utfordring = listItem.get_item("Utfordring"); 
            f.Virksomhet = listItem.get_item("Virksomhet");
            


            fArr.push(f); 
            }
            Callback(fArr);
        
    }, function(sender, args) 
    {
        console.log(args.get_message());
    }); 
}

     formatDate(netdate:string):string
    {
        var year = netdate.substr(0,4);
        var month = netdate.substr(5,2);
        var day = netdate.substr(8,2);
        return day + "." + month + "." + year;
    }

}

interface ViewSuggestionData { Suggestion?:Forslag, LikeEventHandler?():void, LikesThis?:boolean  }
export class ViewSuggestion extends React.Component<void, ViewSuggestionData>
{
    private self:SPUser;
    private likeItemId:number; 
    constructor()
    {
        super();
        this.state = { Suggestion:{ Id:-1, Likes:0 }, LikesThis:false };
        this.self = { DisplayName:"", LoginName:"", Id:_spPageContextInfo.userId }
        this.likeItemId = -1;         
    }

    componentWillMount()
    {
        var suggestionId = 23;
        // Load suggestion
        new ForslagTool().GetById((arr:Array<Forslag>) => 
        {
            if(arr.length <= 0)
                return;               
            
            
            this.setState({Suggestion:arr[0]});
        
        
        }, suggestionId);
            new SPTools.AppFunctions().likeStatus(suggestionId).done( ((result:any) => {
                if(result.d.results.length <= 0)
                    return; 

                this.setState({LikesThis:true });               
                this.likeItemId = result.d.results[0].Id;   
            }).bind(this));
         

    }

    render()
    {
        if(this.state.Suggestion.Id == -1)
            return <div></div>
    return (
            <div>
                <SuggestionDataView Suggestion={this.state.Suggestion} LikeEventHandler={this.HandleLikeClick.bind(this)} LikesThis={this.state.LikesThis} />
                <SuggestionComments Suggestion={this.state.Suggestion} />
            </div>
            )
    }

    HandleLikeClick()
    {
        if(this.state.LikesThis)
            this.Unlike();
        else
            this.Like();
    }

    Unlike() {      
         if(this.likeItemId <= 0)
            return; 

         var context = SP.ClientContext.get_current();
         var list = context.get_web().get_lists().getByTitle("Likerklikk"); 
         var item = list.getItemById(this.likeItemId);
         item.deleteObject();
         context.executeQueryAsync( (r:any) => {            
            this.state.Suggestion.Likes -= 1; 
            this.setState({Suggestion:this.state.Suggestion}); 
            this.setState({LikesThis:false});
            this.UpdateLikeCountInList();
         },
         (err:any) => {
             console.log(err); 
         });

         


    }

    Like() {
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("Likerklikk"); 
            var itemcreationinfo = new SP.ListItemCreationInformation();
            var item = list.addItem(itemcreationinfo);
            
            var suggestionFieldValue = new SP.FieldLookupValue();
            suggestionFieldValue.set_lookupId(this.state.Suggestion.Id);
            
            var person = new SP.FieldUserValue();
            person.set_lookupId(this.self.Id); 

            item.set_item("Forslag", suggestionFieldValue);
            item.set_item("Person", person);
            
        this.setState({LikesThis:true}); 

            item.update();
            context.load(item);
            context.executeQueryAsync( ((result:any) => 
            {
                this.likeItemId = item.get_id();                
                this.state.Suggestion.Likes += 1;                  
                this.setState({Suggestion:this.state.Suggestion});
                this.UpdateLikeCountInList();
            
            }).bind(this),
            (err:any) => { console.log(err); });
    }

    UpdateLikeCountInList()
    {        
         var context = SP.ClientContext.get_current();
         var list = context.get_web().get_lists().getByTitle("Forslag"); 
         var item = list.getItemById(this.state.Suggestion.Id);
         
         console.log(this.state.Suggestion.Likes);
         item.set_item("Likes", this.state.Suggestion.Likes);
         item.update();
         context.executeQueryAsync( ((r:any) => {
                         
         }).bind(this),
         (err:any) => {
             console.log(err); 
         });
    }
}

class SuggestionDataView extends React.Component<ViewSuggestionData, {}>
{
    render() {
        console.log(this.props.Suggestion);
        return (
            <div className="row">
                <div className="col-xs-6">
                    <SuggestionDataHeader Text="Forslag" Display="" />
                    <SuggestionDataRow Text="Forslagsstiller:" Display={this.props.Suggestion.Navn.DisplayName} />
                    <SuggestionDataRow Text="Kommune:" Display={this.props.Suggestion.Kommune} />
                    <SuggestionDataRow Text="Type:" Display={this.props.Suggestion.ForslagType.Title} />
                    <SuggestionDataRow Text="Utfordring:" Display={this.props.Suggestion.Utfordring} />
                    <SuggestionDataRow Text="Nyttig for andre?:" Display={this.props.Suggestion.NyttigForAndre} />                    
                    <SuggestionDataRow Text="Forslag til løsning:" Display={this.props.Suggestion.ForslagTilLosning} />
                    <hr/>
                    <SuggestionDataViewFooter Suggestion={this.props.Suggestion} LikeEventHandler={this.props.LikeEventHandler} LikesThis={this.props.LikesThis} />
                    </div>
                <div className="col-xs-6">
                </div>
            </div>
            )
    }
} 

class SuggestionDataViewFooter extends React.Component<ViewSuggestionData, {}>{
    
    handleLikeClick()
    {
        this.props.LikeEventHandler();
    }

    renderLikes()
    {
        if(this.props.Suggestion.Likes <= 0)
            return <div></div>

        var likes = this.props.Suggestion.Likes; 
        

        return <div className="col-xs-4 likes"><span className="glyphicon glyphicon-thumbs-up"></span>{this.props.Suggestion.Likes}</div>
    }


    renderTags()
    {
              if(this.props.Suggestion.Tags.length <= 0)
                return (
                 <div></div>
             );

             return (
            <div className="col-xs-4 tags">                            
                <ul>
                {this.props.Suggestion.Tags.map( (value:SPTaxonomyTerm, index:number) => {
                   
                    return <li><span className="glyphicon glyphicon-tag"></span>{value.Title}</li>
                })}
                </ul>
            </div>)
    }

    renderLikebutton()
    {
        
        var btnType = (this.props.LikesThis) ? "btn-primary disabled" : "btn-success"; 
        var text = (this.props.LikesThis) ? "Du liker dette" : "Godt forslag!"
        return (
                    <div className="likebutton col-xs-4">
                        <div className={`btn-xs btn-like ${btnType}`} onClick={this.handleLikeClick.bind(this)}><span className="glyphicon glyphicon-thumbs-up"></span>
                        {text}
                        </div>
                    </div>
        );
    }

    render()
    {
        return ( 
            <div className="row">
                <div className="dataviewfooter">                                       
                    {this.renderLikebutton()}                                   
                    {this.renderLikes()}                   
                    {this.renderTags()}
                </div>
            </div>
            
        )
    }
}

interface ViewDataField { Text:string, Display:string }
class SuggestionDataHeader extends React.Component<ViewDataField, {}>
{
    render() {
        return (
        <div className="row">
            <div className="col-xs-12">
                <header><h4>{this.props.Text}</h4></header>
            </div>
        </div>)
    }
}

class SuggestionDataRow extends React.Component<ViewDataField, {}>
{
    render() {
        return (
        <div className="row">
            <div className="col-xs-12">
                <label>{this.props.Text}</label> {this.props.Display}
            </div>
        </div>)
    }
}

class SuggestionComments extends React.Component<ViewSuggestionData, {}>
{
render() {
        return <div></div>
    }
} 