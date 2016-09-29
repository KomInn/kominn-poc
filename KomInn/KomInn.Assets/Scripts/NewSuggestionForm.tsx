import * as React from "react";
import * as $ from "jquery";
import "../Provisioning/SiteAssets/lib/typeahead/typeahead.jquery.js"
import "../Provisioning/SiteAssets/lib/jquery.autogrow-textarea/jquery.autogrow-textarea.js"
import {ListData, UserProfile, ITaxonomyTerm, IUser, Taxonomy, IUserProfileProperty, Suggestion, Suggestions } from "./SPTools"


       
    interface Validator {
        Required:boolean,      
        validate?:boolean
    }
    interface ChangedFieldValues { Value:string, Name:string }
    interface InputFieldProps { Label:string, OnChangeHandler?(evt:ChangedFieldValues):void, Value:string, Name:string, Placeholder?:string, Validate?:boolean, Locked?:boolean, ForceLength?:number}   
    interface InputFieldState { isValid:boolean }

    class TextArea extends React.Component<InputFieldProps, {}>  
    {
        validate():boolean
        {
            if(!this.props.Validate)
                return true; 
            
            if(this.props.Value.length <= 0)            
                return false; 
            
            return true;            
        }

        render() {
            this.validate(); 
            var markErrorClass = "";                
            if(!this.validate())            
                markErrorClass = "label-error";
            
        
            return (<div className="form-group">
                        <label className={markErrorClass}>{this.props.Label}</label> 
                        <textarea type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value} placeholder={this.props.Placeholder}></textarea>
                    </div>);
        }
        handleChange(event:any)
        {   
            this.props.OnChangeHandler({Value:event.target.value, Name:this.props.Name});
        }
    }


    class TextField extends React.Component<InputFieldProps, InputFieldState>
    {
        render() {            
            return <div className="form-group"><label>{this.props.Label}</label> 
            <input type="text" className="form-control" onChange={this.handleChange.bind(this)} value={this.props.Value} placeholder={this.props.Placeholder} onBlur={this.forceLengthCheck.bind(this)}  /></div>
        }
        handleChange(event:any)
        {   
            if(this.props.Locked)
                return; 

           

            this.props.OnChangeHandler({Value:event.target.value, Name:this.props.Name});
        }

        forceLengthCheck(event:any)
        {           
            if(this.props.ForceLength != undefined)
            {
                if(event.target.value.length < this.props.ForceLength || event.target.value.length > this.props.ForceLength)
                    this.setState({isValid:false}); 
                else
                    this.setState({isValid:true});
            }
        }
        renderError()
        {
            if(!this.state.isValid && this.props.Value.length > 0)
            {
                return <label className="label-error">Feltet må ha {this.props.ForceLength} tegn.</label>
            }
        }            
        
    }

    interface SPTaxonomyFieldState { terms?:Array<ITaxonomyTerm>, valueInvalid?:boolean, text?:string }
    interface TaxonomyFieldProps extends InputFieldProps { Termset?:string, LCID?:number, TaxonomySelectedHandler(evt:ITaxonomyTerm):void }
    class SPTaxonomyField extends React.Component<TaxonomyFieldProps, SPTaxonomyFieldState>
    {        
        constructor()
        {
            super();
            this.state = { terms:new Array<ITaxonomyTerm>(), valueInvalid:false, text:"" };
            
        }

        componentDidMount()
        {       
            ExecuteOrDelayUntilScriptLoaded((() => { this.getTaxonomyArray() }).bind(this), "sp.js");
        }

        renderErrorMessage() {
            if(this.state.valueInvalid)
            { 
                return <label className="label-error">Du må velge fra listen.</label>
            } 
            return (<span></span>);
        }

        render(){    

            return <div className="form-group"><label>{this.props.Label}</label>
                <div id="bloodhound">
                    <input className="typeahead form-control" type="text" />
                </div>
                {this.renderErrorMessage()}
            </div>      
        }

      

        onLeave(event:any)
        {              
            var value = event.target.value;
            if(value.length <= 0)   
            {         
                this.setState({valueInvalid:false});
                return; 
            }
            
            for(var i=0;i<this.state.terms.length;i++)
            {
                if(this.state.terms[i].Title == value)
                {   
                    if(this.props.TaxonomySelectedHandler)
                        this.props.TaxonomySelectedHandler(this.state.terms[i]);

                    this.setState({valueInvalid:false}); 
                    return; 
                }
            }
            
            this.setState({valueInvalid:true});
            $(".typeahead").typeahead('val', null);  
        }

        getTaxonomyArray()
        {
           Taxonomy.GetTaxonomyArray(this.props.Termset, this.props.LCID)
            .done( (result:Array<ITaxonomyTerm>) => {                
                this.setState({terms:result});
                this.initTypeahead();
            });
        }  

        
        public CBSync:(datums:Array<ITaxonomyTerm>) => void;
        initTypeahead()
        {           
            var bo: Bloodhound.BloodhoundOptions<ITaxonomyTerm> = { 
                    datumTokenizer:(d) => {                       
                        return Bloodhound.tokenizers.whitespace(d.Title); 
                        },
                    queryTokenizer:Bloodhound.tokenizers.whitespace,                     
                    local:this.state.terms 
            };             
            var engine = new Bloodhound<ITaxonomyTerm>(bo);        
            var dataset: Twitter.Typeahead.Dataset<string> = { source: d, display:"Title" };        
            var options: Twitter.Typeahead.Options = { highlight:true, hint:true, minLength:0 };
            $(".typeahead").typeahead(options, dataset).blur(this.onLeave.bind(this));
            $(".typeahead").on("typeahead:selected", handler.bind(this)); 
            
            function handler(obj:any, datum:ITaxonomyTerm, name:any) {                
                if(this.props.TaxonomySelectedHandler)
                    this.props.TaxonomySelectedHandler(datum);
                
                this.setState({valueInvalid:false}); 
                
            };        
            function d(q:string, CBSync:any)
            {
                (q == '') ? CBSync(engine.all()) : engine.search(q, CBSync, null);
            }
        }
    }

    interface NewSuggestionFormState { suggestion?:Suggestion, submitted?:boolean, submitValidationFailed?:boolean, validate?:boolean, postalCodeInvalid?:boolean, postalCodeText?:string, submitFailed?:boolean, submitting?:boolean };
    export class NewSuggestionForm extends React.Component<void, NewSuggestionFormState> {  
        constructor() {
            super();
            var suggestion = new Suggestion(); 
            this.state = {  suggestion:suggestion, submitted:false, validate:false, postalCodeInvalid:false, postalCodeText:"", submitValidationFailed:false, submitFailed:false }
                       
        }
        componentWillMount()
        {
            this.state.suggestion.PopulateFromUserProfile()
                .done(((result:Suggestion) =>
                {
                    this.setState({suggestion:result});                    
                }).bind(this));
        }

         componentDidMount() {            
            $("textarea[class='form-control']").autogrow({horizontal:false, vertical:true, characterSlop:0}); 
        }
        
    

        submitForm(data:any) {
            if(this.state.submitting)
                return; 
            
          
            
            if(!this.doesFormValidate())
            {    
                this.setState({validate:true});
                this.setState({submitValidationFailed:true});          
                return; 
            }
            this.setState({submitting:true})   
            this.state.suggestion.Save()
                .done( (() => 
                {
                    this.setState({submitted:true});                     
                }).bind(this))
                .fail( (() => {
                    this.setState({submitFailed:true});
                    this.setState({submitting:false})
                }).bind(this));

            
        }

        changeEvent(d:ChangedFieldValues)
        {                              
            var obj:any = this.state.suggestion; 
            obj[d.Name] = d.Value; 
            this.setState({suggestion:obj});            
        }

        typeUtfordringSelectedHandler(d:ITaxonomyTerm)
        {         
            this.state.suggestion.ForslagType = d; 
            this.setState({suggestion:this.state.suggestion});
        }

        userResolvedHandler(u:IUser)
        {
            this.state.suggestion.Navn = u; 
            this.setState({suggestion:this.state.suggestion});        
        }

        debugMsg(a:any)
        {            
            console.log(this.state);           
        }

        doesFormValidate():boolean
        {
            var canSubmit = true;            

            if(this.state.suggestion.ForslagTilLosning.length <= 0)
                canSubmit = false;

            if(this.state.suggestion.Utfordring.length <= 0)
                canSubmit = false; 

            if(this.state.suggestion.NyttigForAndre.length <= 0)
                canSubmit = false; 

            if(!canSubmit)
                this.setState({submitValidationFailed:true});

            return canSubmit; 
        }

        postnrLookup(d:ChangedFieldValues)
        {   
            this.setState({postalCodeText:d.Value});            
            if(d.Value.length != 4 || d.Value == this.state.suggestion.Postnummer)
                return; 
                
            ListData.getDataFromList("Kommunenumre", "?$select=Kommune,Kommunenummer&$filter=Postnummer eq '" + d.Value+"'")
                .done( ((result:any) => 
                { 
                    if(result.d.results.length <= 0)
                    {
                        this.setState({postalCodeInvalid:true})
                        return;
                    }
                    this.state.suggestion.Postnummer = d.Value;
                    this.state.suggestion.Kommune = result.d.results[0].Kommune;
                    this.state.suggestion.Kommunenummer = result.d.results[0].Kommunenummer;
                    this.setState({suggestion:this.state.suggestion});
                    this.setState({postalCodeInvalid:false})
                    this.setState({postalCodeText: d.Value + " ("+result.d.results[0].Kommune+")"})
                }).bind(this)).fail( (() => {
                    this.setState({postalCodeInvalid:true})
                }).bind(this));
                
        }

        renderPostalCodeError()
        {    
            if(this.state.postalCodeInvalid)        
                return <label style={{color:'red'}}>Postnummeret ble ikke funnet.</label>
        }

        renderSubmitValidationFailed()
        {
            if(this.state.submitValidationFailed)
                return <label style={{color:'red'}}><br/>Vennligst fyll ut feltene i rødt.</label>
        }

        rendersubmitFailed()
        {
            if(this.state.submitFailed)
                return <label style={{color:'red'}}><br/> En feil oppstod ved innsending av skjemaet. Prøv på nytt senere.</label>
        }

        render() { 
            if(this.state.submitted)
                return <ThankYouPage />

            if(this.state.submitting)
                return <h4>Sender...</h4>


            return (<div><div className="row">
                        <div className="col-xs-12"> 
                            <h1>Nytt forslag</h1>
                            <p>Tekst her?</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4 col-md-4 ">   
                            <TextField Label="Postnummer" OnChangeHandler={this.postnrLookup.bind(this)} Value={this.state.postalCodeText} Name="Postnummer" ForceLength={4} />
                            { this.renderPostalCodeError() }
                            <TextArea Label="Utfordring *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.Utfordring} Name="Utfordring" Placeholder="Fortell om utfordringen" Validate={this.state.validate} />
                            <TextArea Label="Forslag til løsning *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.ForslagTilLosning} Name="ForslagTilLosning"   Validate={this.state.validate}  />
                            <TextArea Label="Nyttig for andre? *" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.NyttigForAndre} Name="NyttigForAndre" Validate={this.state.validate} />
                            <SPTaxonomyField Label="Type nytte / nytteverdi" Value="" Name="ForslagType" Termset="ForslagType" LCID={1033} TaxonomySelectedHandler={this.typeUtfordringSelectedHandler.bind(this)} />                            
                            <input type="button" onClick={this.submitForm.bind(this)} value="Send inn"/>   
                            { this.renderSubmitValidationFailed() }  
                            { this.rendersubmitFailed() }                      
                        </div>
                        <div className="col-xs-12 col-sm-4  col-md-4 ">                                                
                            <TextField Label="Navn" Value={this.state.suggestion.Navn.DisplayName} Name="Navn" Locked={true}  />
                            <TextField Label="Adresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.Adresse} Name="Adresse" />                               
                            <TextField Label="Mailadresse" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.Epostadresse} Name="Epostadresse"/>
                            <TextField Label="Telefon" OnChangeHandler={this.changeEvent.bind(this)} Value={this.state.suggestion.Telefon} Name="Telefon"  />                     
                        </div>                   
                    </div>
                </div>)
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
                   
                    <a href={`${_spPageContextInfo.webAbsoluteUrl}/SitePages/Home.aspx`}>Tilbake til oversikten</a>
                </div>
            </div>
        }
    }
/*
<SPUserField Label="Nærmeste leder" Value={this.state.leder.DisplayName} Name="leder" UsernameResolvedHandler={this.lederResolvedHandler.bind(this)} ref="LederTxtHook"  />
*/