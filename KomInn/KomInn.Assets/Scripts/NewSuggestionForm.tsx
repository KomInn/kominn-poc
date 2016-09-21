import * as React from "react";
import * as $ from "jquery";
import "../Provisioning/SiteAssets/lib/typeahead/typeahead.jquery.js"
import "../Provisioning/SiteAssets/lib/jquery.autogrow-textarea/jquery.autogrow-textarea.js"
import * as SPTools from "./SPTools"


    class Option {
        Value:string; Text:string
        constructor(v:string, t:string) { this.Value = v; this.Text = t }     
    }

    
    interface Validator {
        Required:boolean,      
        validate?:boolean
    }
    interface ChangedFieldValues { Value:string, Name:string }
    interface InputFieldProps { Label:string, OnChangeHandler?(evt:ChangedFieldValues):void, Value:string, Name:string, Placeholder?:string, Validate?:boolean }
    interface TaxonomyFieldProps extends InputFieldProps { Termset?:string, LCID?:number, TaxonomySelectedHandler(evt:Term):void }
    interface UserFieldProps extends InputFieldProps { UsernameResolvedHandler(user:User):void, Username?:string, DisplayName?:string, Ref?:SPUserField }


    class TextArea extends React.Component<InputFieldProps, {}>  
    {
        
        render() {
            var markErrorClass = "";
            if(this.props.Validate)
                markErrorClass = (this.props.Value.length > 0) ? "" : "label-error"; 

        
            return <div className="form-group"><label className={markErrorClass}>{this.props.Label}</label> 
            <textarea type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value} placeholder={this.props.Placeholder}></textarea></div>
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
            <input type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value} placeholder={this.props.Placeholder}  /></div>
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
            <input type="text" className="form-control pt-userfield" onChange={this.handleChange.bind(this)} onKeyDown={this.handleUserResolve.bind(this)} value={this.state.Text} placeholder="Skriv brukernavn og trykk Enter" /></div>
        }
        handleChange(event:any)
        {   
            this.setState({Text:event.target.value}); 
        }

        resolveUser()
        {
           var up = new SPTools.UserProfile();
           up.ensureUser(this.state.Text).done((result:any) => {
               let user:User = {DisplayName: result.d.Title, Username:result.d.LoginName, UserId:result.d.Id  };
               this.setState({Text:user.DisplayName});
               this.props.UsernameResolvedHandler(user);              
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
        kommune?:string;
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
        navn?:User;   
        konkurransereferanse?:string;
        submitted?:boolean;
        validateUtfordring?:boolean;
        validateForslag?:boolean;
        validateNyttigforandre?:boolean; 
        showValidationFailMessage?:boolean;
        
    }


    interface UserProfileProperty { Key:string, Value:string, ValueType:string };

    export class NewSuggestionForm extends React.Component<void, FormDataState> {   
        
        state:FormDataState;
        
        
        constructor() {
            super(); 
            
            this.state = { 
                    kommunenr:"", postnummer:"", adresse:"", avdeling:"", leder: {DisplayName:"", UserId:-1, Username:"" },
                    mailadresse:"", telefon:"", dato:"", typeutfordring:{Name:"", Id:""}, utfordring:"", forslag:"", nyttigforandre:"", virksomhet:"",
                    navn:{DisplayName:"", UserId:-1, Username:"" }, konkurransereferanse:"", submitted:false
                
            }
            
            this.loadAndAssignUserProfilePropsAsync();            
        }

         componentDidMount() {            
            $("textarea[class='form-control']").autogrow({horizontal:false, vertical:true, characterSlop:0}); 
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
                    this.setState({dato:this.getTodaysDate()});
                    this.setState({konkurransereferanse: GetUrlKeyValue("ref")});
                    
                    var manager = this.findKey(props, "Manager").Value;
                    var up = new SPTools.UserProfile();
                    up.ensureUser(manager).done( ((d:any) => {
                                console.log(d);
                                this.setState({
                                    leder: {
                                            DisplayName:d.d.Title, 
                                            Username:d.d.LoginName,
                                            UserId:d.d.Id
                                    }
                                });
                                console.log(this.state.leder);

                      }).bind(this));
                    // Navn                
                    this.setState(
                    {navn:
                        {
                            DisplayName:e.d.DisplayName, 
                            Username:e.d.AccountName, 
                            UserId:_spPageContextInfo.userId
                        }
                    });
                    this.refs.UserTxtHook.setText(this.state.navn.Username);
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
            if(!this.doesFormValidate())
            {              
                return; 
            }

            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("Forslag"); 
            var itemcreationinfo = new SP.ListItemCreationInformation();
            var item = list.addItem(itemcreationinfo);
            item.set_item("Adresse", this.state.adresse);
            item.set_item("Avdeling", this.state.avdeling);
            item.set_item("E_x002d_postadresse", this.state.mailadresse);
            item.set_item("Forslag_x0020_til_x0020_l_x00f8_", this.state.forslag);
            item.set_item("ForslagStatus", "Sendt inn");
            item.set_item("Kommune", this.state.kommune); 
            item.set_item("Kommunenummer", this.state.kommunenr);
            item.set_item("Konkurransereferanse", this.state.konkurransereferanse); 
            item.set_item("Nyttig_x0020_for_x0020_andre_x00", this.state.nyttigforandre);
            item.set_item("Postnummer", this.state.postnummer);
            item.set_item("Telefon", this.state.avdeling);
            item.set_item("Utfordring", this.state.utfordring);
            item.set_item("Virksomhet", this.state.virksomhet);
        
            var manager = new SP.FieldUserValue();
            manager.set_lookupId(this.state.leder.UserId);         
            item.set_item("N_x00e6_rmeste_x0020_leder", manager);

            var self = new SP.FieldUserValue();
            self.set_lookupId(_spPageContextInfo.userId);
            item.set_item("Navn", self); 
            
            if(this.state.typeutfordring.Name.length > 0)
            {
                // ForslagType
                var taxSingle = new SP.Taxonomy.TaxonomyFieldValue();            
                taxSingle.set_termGuid(new SP.Guid(this.state.typeutfordring.Id)); 
                taxSingle.set_label(this.state.typeutfordring.Name);
                taxSingle.set_wssId(-1);
                item.set_item("ForslagType", taxSingle);   
            }     

            item.update(); 
            context.load(item);
            context.executeQueryAsync(s.bind(this), f);
            function s(d:any){
                console.log("Success!");
                console.log(d);
                this.setState({submitted:true});
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

        userResolvedHandler(u:User)
        {
            this.setState({navn:u});        
        }

        debugMsg(a:any)
        {            
            console.log(this.state);
           
        }

        doesFormValidate():boolean
        {
            var canSubmit = true;
            console.log(this.state);
            if(this.state.utfordring.length <= 0)
            {
                this.setState({validateUtfordring:true});
                canSubmit = false;
                console.log("1");
            }
            
            if(this.state.forslag.length <= 0)
            {
                this.setState({validateForslag:true});
                canSubmit = false;             
            } 
            
            if(this.state.nyttigforandre.length <= 0)
            {
                this.setState({validateNyttigforandre:true});
                canSubmit = false;              
            } 
            if(!canSubmit)
              this.setState({showValidationFailMessage:true});

            return canSubmit; 
        }

        postnrLookup(d:ChangedFieldValues)
        {
            this.setState({postnummer:d.Value});
            if(d.Value.length != 4 || d.Value == this.state.postnummer)
                return; 
            

                var ld = new SPTools.ListData();
                ld.getDataFromList("Kommunenumre", "?$select=Kommune,Kommunenummer&$filter=Postnummer eq " + d.Value)
                    .done((result:any) => 
                    { 
                        console.log(result);
                        if(result.d.results.length <= 0)
                            return;

                        this.state.kommune = result.d.results[0].Kommune;
                        this.state.kommunenr = result.d.results[0].Kommunenummer;  
                    });
                
        }

        render() { 

            let textAreaValidator:Validator = { Required:true,validate:true };

            if(this.state.submitted)
                return <ThankYouPage />

            var hideErrorLabel:any = { display:"none", color:"black" }; 
            if(this.state.showValidationFailMessage)
                hideErrorLabel = { display: "block", color:"red"};

            return <div><div className="row">
                        <div className="col-xs-12">
                            <h1>Nytt forslag</h1>
                            <p>Tekst her?</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4 col-md-4 ">   
                            <TextField Label="Postnummer" OnChangeHandler={this.postnrLookup.bind(this)} Value={this.state.postnummer} Name="postnummer" />
                            <TextArea Label="Utfordring *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.utfordring} Name="utfordring" Placeholder="Fortell om utfordringen" Validate={this.state.validateUtfordring} />
                            <TextArea Label="Forslag til løsning *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.forslag} Name="forslag"   Validate={this.state.validateForslag}  />
                            <TextArea Label="Nyttig for andre? *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.nyttigforandre} Name="nyttigforandre" Validate={this.state.validateNyttigforandre} />
                            <SPTaxonomyField Label="Type nytte / nytteverdi" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.typeutfordring.Name} Name="typeutfordring" Termset="ForslagType" LCID={1033} TaxonomySelectedHandler={this.typeUtfordringSelectedHandler.bind(this)} />
                            <p class="error-label" style={hideErrorLabel}>Vennligst fyll ut feltene i rødt.</p>
                            <input type="button" onClick={this.submitForm.bind(this)} value="Send inn"/>                           
                        </div>
                        <div className="col-xs-12 col-sm-4  col-md-4 ">                                                
                            <SPUserField Label="Navn" Value={this.state.navn.DisplayName} Name="navn" UsernameResolvedHandler={this.userResolvedHandler.bind(this)} ref="UserTxtHook"  />
                            <TextField Label="Adresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.adresse} Name="adresse" />                               
                            <TextField Label="Mailadresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.mailadresse} Name="mailadresse"/>
                            <TextField Label="Telefon" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.telefon} Name="telefon"  />                     
                        </div>                   
                    </div>
                </div>
        }
    }
    


    class ThankYouPage extends React.Component<void, {}>
    {
        
       
        render()
        {
            return <div className="row">
                <div className="col-xs-12">
                    <h1>Takk for ditt bidrag!</h1>
                    <p>Du hører fra oss snarlig.</p>
                   
                    <a href="/SitePages/Home.aspx">Tilbake til oversikten</a>
                </div>
            </div>
        }
    }
/*
<SPUserField Label="Nærmeste leder" Value={this.state.leder.DisplayName} Name="leder" UsernameResolvedHandler={this.lederResolvedHandler.bind(this)} ref="LederTxtHook"  />
*/