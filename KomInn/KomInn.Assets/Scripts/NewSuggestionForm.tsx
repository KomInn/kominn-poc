import * as React from "react";
import * as $ from "jquery";
import "../Provisioning/SiteAssets/lib/typeahead/typeahead.jquery.js"
class Option {
     Value:string; Text:string
     constructor(v:string, t:string) { this.Value = v; this.Text = t }     
}

interface ChangedFieldValues { Value:string, Name:string }
interface InputFieldProps { Label:string, OnChangeHandler?(evt:ChangedFieldValues):void, Value:string, Name:string}
interface TaxonomyFieldProps extends InputFieldProps { Termset?:string, LCID?:number, TaxonomySelectedHandler(evt:Term):void }
interface UserFieldProps extends InputFieldProps { UsernameResolvedHandler(user:User):void, Username?:string, DisplayName?:string, Ref?:SPUserField }


class TextArea extends React.Component<InputFieldProps, {}>  
{
    render() {
        return <div className="form-group"><label>{this.props.Label}</label> 
        <textarea type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value}></textarea></div>
    }
    handleChange(event:any)
    {   
        this.props.OnChangeHandler({Value:event.target.value, Name:this.props.Name});
    }
}

class TextField extends React.Component<InputFieldProps, {}>
{
     render() {
        return <div className="form-group"><label>{this.props.Label}</label> 
        <input type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value}  /></div>
    }
    handleChange(event:any)
    {   

        this.props.OnChangeHandler({Value:event.target.value, Name:this.props.Name});
    }
}

interface User { DisplayName:string, Username:string, UserId:number }
interface FieldState { Text:string }
class SPUserField extends React.Component<UserFieldProps, FieldState>
{
    user:User; 
    state:FieldState; 
        
    constructor()
    {
        super();
        this.user = { DisplayName:"", Username:"", UserId:-1 }
        this.state = { Text:"" };
    }
    render() {
        this.props.Ref = this; 
        return <div className="form-group"><label>{this.props.Label}</label> 
        <input type="text" className="form-control pt-userfield" onChange={this.handleChange.bind(this)} onKeyDown={this.handleUserResolve.bind(this)} value={this.state.Text}  /></div>
    }
    handleChange(event:any)
    {   
       this.setState({Text:event.target.value}); 
    }

    resolveUser()
    {
        var username = this.state.Text;         
      
        console.log("USER RESOLVED HJANDLER");
         
        var payload = { 'logonName': username }; 
        var request =  $.ajax({
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            data: JSON.stringify(payload),
                            headers: {
                                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                "accept": "application/json;odata=verbose"
                            },
                            success:(d:any) => 
                            {
                                this.user = { DisplayName: d.d.Title, Username: d.d.LoginName, UserId:d.d.Id };        
                                this.setState({Text:this.user.DisplayName});        
                                this.props.UsernameResolvedHandler(this.user);
                            }, 
                            error:(err) => { console.log(err); }
              });
    }

    handleUserResolve(event:any)
    {       
        if(event.keyCode != 13)
            return; 
        
       this.resolveUser();
    }

    setText(text:string)
    {
        console.log("HI!");
        this.setState({Text:text});
        this.resolveUser();
    }

    

   
}


interface Term { Name:string, Id:string }
class SPTaxonomyField extends React.Component<TaxonomyFieldProps, {}>
{
    terms:Array<Term>

    constructor()
    {
        super();
        this.terms = new Array<Term>();
    }

    componentDidMount()
    {       
        ExecuteOrDelayUntilScriptLoaded((() => { this.getTaxonomyArray(this.props.Termset, this.props.LCID) }).bind(this), "sp.js");
    }
    render(){          
        return <div className="form-group"><label>{this.props.Label}</label>
            <div id="bloodhound">
                <input className="typeahead form-control" type="text" />
            </div>
        </div>      
    }
    handleChange(event:any) // TODO: Verify that it doesn't work and remove this. Replaced by event handling function in this.initTypeahead()
    {  
        this.props.OnChangeHandler({Value:event.target.value, Name:this.props.Name});
        
    }

    getTaxonomyArray(termset:string, language:number)
    {
        //var termset = "ForslagType";      
        var context = SP.ClientContext.get_current();      
        var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        var termStore = taxSession.getDefaultSiteCollectionTermStore();        
        var termSets = termStore.getTermSetsByName(termset, language);
        var termSet = termSets.getByName(termset);
        var terms = termSet.getAllTerms();     
        context.load(terms);
        context.executeQueryAsync(sh.bind(this), err);

        function sh(sender:any, args:any)
        {
            var te = terms.getEnumerator();
            if(this.terms == null)
                this.terms = new Array<Term>();

            while(te.moveNext()){
                var t = te.get_current();
                var term = t.get_name();
                var id = t.get_id().toString();
                this.terms.push({Name:term, Id:id});                    
            } 
            this.initTypeahead();
            
        }
        function err()
        {
            console.log(arguments[1].get_message());
        }
    }  

    
    public CBSync:(datums:Term[]) => void;
    initTypeahead()
    {
        console.log(this.terms);
           var bo: Bloodhound.BloodhoundOptions<Term> = { 
               	datumTokenizer:(d) => {                       
                       return Bloodhound.tokenizers.whitespace(d.Name); 
                    },
                queryTokenizer:Bloodhound.tokenizers.whitespace,                     
                local:this.terms 
        };             
        var engine: Bloodhound<Term> = new Bloodhound<Term>(bo);        
        var dataset: Twitter.Typeahead.Dataset<string> = { source: d, display:"Name" };        
        var options: Twitter.Typeahead.Options = { highlight:true, hint:true, minLength:0 };
        $(".typeahead").typeahead(options, dataset);
        $(".typeahead").on("typeahead:selected", handler.bind(this)); 
        
        function handler(obj:any, datum:Term, name:any) {
             if(this.props.OnChangeHandler)
                this.props.OnChangeHandler({Value:datum.Name, Name:this.props.Name});
            
            if(this.props.TaxonomySelectedHandler)
                this.props.TaxonomySelectedHandler(datum);
              
        };        
        function d(q:string, CBSync:any)
        {
            (q == '') ? CBSync(engine.all()) : engine.search(q, CBSync, null);
        }
    }
}



interface FormDataState {
    kommunenr?:string;
    postnummer?:string;
    adresse?:string;
    avdeling?:string;
    leder?:User;
    mailadresse?:string;
    telefon?:string;
    dato?:string;
    typeutfordring?:Term;
    utfordring?:string;
    forslag?:string;
    nyttigforandre?:string;  
    virksomhet?:string;    
       
}


interface UserProfileProperty { Key:string, Value:string, ValueType:string };

export class NewSuggestionForm extends React.Component<void, FormDataState> {   
    
    state:FormDataState;
    constructor() {
        super(); 
          
        this.state = { 
                kommunenr:"0220", postnummer:"1384", adresse:"", avdeling:"", leder: {DisplayName:"", UserId:-1, Username:"" },
                mailadresse:"", telefon:"", dato:"", typeutfordring:{Name:"", Id:""}, utfordring:"", forslag:"", nyttigforandre:"", virksomhet:""
              
        }
        
        this.loadAndAssignUserProfilePropsAsync();
      
    }
    
    loadAndAssignUserProfilePropsAsync()
    {
        $.ajax({
            url:_spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/getmyproperties", 
            type:"GET", 
            headers:{ "Accept":"application/json;odata=verbose" },
            success:successHandler.bind(this), 
            error:function(err){

            }
        });                    

        function successHandler(e:any) 
        {
                var props = e.d.UserProfileProperties.results;
                this.setState({adresse:this.findKey(props, "Office").Value});
                this.setState({avdeling:this.findKey(props, "Department").Value});
                this.setState({mailadresse:this.findKey(props, "WorkEmail").Value});
                this.setState({telefon:this.findKey(props, "CellPhone").Value});                                                
                this.setState({virksomhet:this.findKey(props, "SPS-JobTitle").Value});
                this.setState({dato:this.getTodaysDate()})
                var manager = this.findKey(props, "Manager").Value; 
                this.refs.LederTxtHook.setText(manager);
        }

          
    }  

    findKey(coll:Array<UserProfileProperty>, key:string):UserProfileProperty
    {        
        for(var i=0;i<coll.length;i++)
        {
            if(coll[i].Key == key)
                return coll[i];
        }      
    }

    getTodaysDate()
    {
        var d = new Date();
        return d.getDate() + "." + (d.getMonth() +1) + "." + d.getFullYear();
    }

   

    submitForm(data:any) {
         var context = SP.ClientContext.get_current();
         var list = context.get_web().get_lists().getByTitle("Forslag"); 
         var itemcreationinfo = new SP.ListItemCreationInformation();
         var item = list.addItem(itemcreationinfo);
         item.set_item("Adresse", this.state.adresse);
         item.set_item("Avdeling", this.state.avdeling);
         item.set_item("E_x002d_postadresse", this.state.mailadresse);
         item.set_item("Forslag_x0020_til_x0020_l_x00f8_", this.state.forslag);
         item.set_item("ForslagStatus", "Sendt inn");
         item.set_item("Kommune", "Asker"); // TODO: Resolve from kommunenr
         item.set_item("Kommunenummer", this.state.kommunenr);
         item.set_item("Konkurransereferanse", ""); // TODO: Resolve from querystring
                  
         var manager = new SP.FieldUserValue();
         manager.set_lookupId(this.state.leder.UserId);         
         item.set_item("N_x00e6_rmeste_x0020_leder", manager);

         var self = new SP.FieldUserValue();
         self.set_lookupId(_spPageContextInfo.userId);
         item.set_item("Navn", self); 

         // ForslagType
         var taxSingle = new SP.Taxonomy.TaxonomyFieldValue();            
         taxSingle.set_termGuid(new SP.Guid(this.state.typeutfordring.Id)); 
         taxSingle.set_label(this.state.typeutfordring.Name);
         taxSingle.set_wssId(-1);
         

         item.set_item("ForslagType", taxSingle);        

         item.set_item("Nyttig_x0020_for_x0020_andre_x00", this.state.nyttigforandre);
         item.set_item("Postnummer", this.state.postnummer);
         item.set_item("Telefon", this.state.avdeling);
         item.set_item("Utfordring", this.state.utfordring);
         item.set_item("Virksomhet", this.state.virksomhet);
         

         item.update(); 
         context.load(item);
         context.executeQueryAsync(s, f);
         function s(d:any){
             console.log("Success!");
             console.log(d);
         }

         function f(d:any, args:any)
         {
             console.log("Error :( ");
             console.log(d);
             console.log(args.get_message());
         }


    }

    changeEvent(d:ChangedFieldValues)
    {       
        var obj:any = {};
        obj[d.Name] = d.Value;       
        this.setState(obj);        
    }

    typeUtfordringSelectedHandler(d:Term)
    {
        this.setState({typeutfordring:d});
    }

    lederResolvedHandler(u:User)
    {
        this.setState({leder:u});        
    }

    debugMsg(a:any)
    {
                
    }

    render() {        
        return <div className="row">
                    <div className="col-xs-12 col-sm-4 col-md-4 col-md-push-4 col-sm-push-4">
                        <SPTaxonomyField Label="Type nytte / nytteverdi" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.typeutfordring.Name} Name="typeutfordring" Termset="ForslagType" LCID={1033} TaxonomySelectedHandler={this.typeUtfordringSelectedHandler.bind(this)} />
                        <TextArea Label="Utfordring" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.utfordring} Name="utfordring"/>
                        <TextArea Label="Forslag til løsning" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.forslag} Name="forslag"/>
                        <TextArea Label="Nyttig for andre?" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.nyttigforandre} Name="nyttigforandre"/>
                        <input type="button" onClick={this.submitForm.bind(this)} value="Send inn"/>
                        <input type="button" onClick={this.debugMsg.bind(this)} value="DEBUG" />
                    </div>
                    <div className="col-xs-12 col-sm-4  col-md-4 col-md-pull-4 col-sm-pull-4">
                        <TextField Label="Kommunenr" OnChangeHandler={this.changeEvent.bind(this)}  Value={this.state.kommunenr} Name="kommunenr" />
                        <TextField Label="Postnr." OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.postnummer} Name="postnummer" />
                        <TextField Label="Adresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.adresse} Name="adresse" />
                        <TextField Label="Avdeling" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.avdeling} Name="avdeling" />
                        <TextField Label="Virksomhet" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.virksomhet} Name="virksomhet" />
                        <SPUserField Label="Nærmeste leder" Value={this.state.leder.DisplayName} Name="leder" UsernameResolvedHandler={this.lederResolvedHandler.bind(this)} ref="LederTxtHook"  />
                        <TextField Label="Mailadresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.mailadresse} Name="mailadresse"/>
                        <TextField Label="Telefon" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.telefon} Name="telefon"  />
                        <TextField Label="Dato" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.dato} Name="dato"/>
                    </div>                   
                </div>
    }
}