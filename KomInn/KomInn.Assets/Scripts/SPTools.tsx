/* SPTools.tsx
   Description: Data handler adapters for solution data management. 
*/

$.ajaxSetup({headers: {"Accept": "application/json;odata=verbose"}})

export interface IUser {
    DisplayName?:string,
    LoginName?:string,
    Id?:number
}

export interface ITaxonomyTerm 
{
    Title?:string, 
    Id?:string
}

export class UserProfile 
{
    ensureUser(username:string):JQueryPromise<any>      
    {            
        var payload = { 'logonName': username }; 
        return $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
                        type: "POST",
                        contentType: "application/json;odata=verbose",
                        data: JSON.stringify(payload),
                        headers: {
                            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                            "accept": "application/json;odata=verbose"
                        }}).then((data:any) => { return data; })
                        .fail((err:any) => { return err });
    }

    // Returns the profile picture URL for the specified user
    public static GetProfileImageFor(username:string):JQueryPromise<string>
    {
        var df = $.Deferred();
        new UserProfile().ensureUser(username).done( (user:any) => {
            console.log(user);
            return $.get(_spPageContextInfo.webAbsoluteUrl + 
            "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(accountname=@v)?@v='"+user.d.LoginName.replace("#","%23")+"'").done( (res:any) => {
                console.log(res);
                console.log(res.d.PictureUrl);
                df.resolve(res.d.PictureUrl);
            })
        });
        return df.promise();
    }

}

export class Taxonomy
{
    
}

export class ListData
{
    public static getDataFromList(listName:string, odata:string):JQueryPromise<any>
    {
        return $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+listName+"')/Items"+odata)
            .then((data:any) => { return data });
    }
}

export class Like
{
    public Loaded:boolean; // No like / unlike operations can take place before object is loaded. 
    public Processing:boolean; // While processing, no like/unlike operations can take place. 
    public UserLikesThis:boolean;
    private LikeListItemId:number; 
    private SuggestionItem:Suggestion;  
    constructor(suggestion:Suggestion)
    {
        if(suggestion == null)
            return; 
        
        this.SuggestionItem = suggestion;        
        this.UserLikesThis = false;
        this.Loaded = false;
        this.Processing = false; 
            
    }

    public static LoadForSuggestion(suggestion:Suggestion):JQueryPromise<Like>
    {
        var df = $.Deferred();
         ListData.getDataFromList("Likerklikk", 
        "?$select=*,Forslag/Id,Person/Id&$expand=Forslag,Person&$filter=Forslag/Id eq " + suggestion.Id + " and Person/Id eq " + _spPageContextInfo.userId )
        .then( ((d:any) => {
            var like = new Like(suggestion);           
            like.Loaded = true;
            if(d.d.results.length <= 0)
            {
                df.resolve(like);
                return; 
            }            
            like.UserLikesThis = true;
            like.setLikeListItemId(d.d.results[0].Id);            
            df.resolve(like);
        }).bind(this),
        () => { df.reject(); }); 
        return df.promise();   

    }

    public LikeUnlike():JQueryPromise<{}>
    {
        if(this.UserLikesThis)
            return this.Unlike();
        else
            return this.Like(); 
        
    }

    public setLikeListItemId(id:number)
    {
        this.LikeListItemId = id; 
    }

    // Returns: number of likes
    private Like():JQueryPromise<number>
    {
        var df = $.Deferred();
        if(this.Processing)
        {
            df.reject(); 
            return df.promise();
        }
        
        this.Processing = true;         
        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle("Likerklikk"); 
        var itemcreationinfo = new SP.ListItemCreationInformation();
        var item = list.addItem(itemcreationinfo);        
        var suggestionFieldValue = new SP.FieldLookupValue();
        suggestionFieldValue.set_lookupId(this.SuggestionItem.Id);
        
        var person = new SP.FieldUserValue();
        person.set_lookupId(_spPageContextInfo.userId);
        item.set_item("Forslag", suggestionFieldValue);
        item.set_item("Person", person);
        item.update();
        context.load(item);
        context.executeQueryAsync( ((result:any) => 
        {        
            this.SuggestionItem.Likes += 1;       
             this.UpdateLikeCountInList().then( () => {
                 this.LikeListItemId = item.get_id(); 
                 this.UserLikesThis = true;                 
                 this.Processing = false; 
                 df.resolve(this.SuggestionItem.Likes);
               })                    
        }).bind(this),
        (err:any) => { console.log(err); 
            df.reject(err);
        });

        return df.promise();
    }

    // Returns: number of likes
    private Unlike():JQueryPromise<number>
    {      
        var df = $.Deferred();  
        if(this.Processing || !this.UserLikesThis)
        {
            df.reject();
            return df.promise();  
        }
         this.Processing = true;

         var context = SP.ClientContext.get_current();
         var list = context.get_web().get_lists().getByTitle("Likerklikk"); 
         var item = list.getItemById(this.LikeListItemId);
         item.deleteObject();
         context.executeQueryAsync( ((r:any) => {
             this.SuggestionItem.Likes -= 1;                          
               this.UpdateLikeCountInList().then( () => {
                   this.UserLikesThis = false;                   
                   this.Processing = false; 
                   df.resolve(this.SuggestionItem.Likes);
               })            
         }).bind(this),
         (err:any) => {
             df.reject(err); 
         });
         return df.promise();         
    }

    private UpdateLikeCountInList():JQueryPromise<{}>
    {            
         var df = $.Deferred();
         var context = SP.ClientContext.get_current();
         var list = context.get_web().get_lists().getByTitle("Forslag"); 
         var item = list.getItemById(this.SuggestionItem.Id);
         
         
         item.set_item("Likes", this.SuggestionItem.Likes);
         item.update();
         context.executeQueryAsync( ((r:any) => {
                df.resolve();         
         }).bind(this),
         (err:any) => {             
             console.log(err);
             df.reject(err);
         });

         return df.promise();
    }
}  

export interface Comment { Text?:string, Person?:IUser, Timestamp?:string, Image?:string };
export class Comments 
{  
    public static AllComments(suggestion:Suggestion):JQueryPromise<Array<Comment>>
    {            
            var df = $.Deferred();
            ListData.getDataFromList("Kommentarer", 
            "?$select=Kommentar,Forslag/Id,Person/Title,Created,Person/Id,Person/UserName&$expand=Forslag,Person&$filter=Forslag/Id eq " + suggestion.Id).then( ((d:any) => {                 
                var comments = new Array<Comment>();               
                for(var i=0;i<d.d.results.length;i++)
                {
                    let item = d.d.results[i];
                    comments.push({
                       Text:item.Kommentar.replace(/\r?\n/g, '<br />'),
                       Person:{
                          DisplayName:item.Person.Title, 
                          LoginName:item.Person.UserName, 
                          Id:item.Person.Id
                       }, 
                       Timestamp: this.formatDate(item.Created), 
                       Image:""
                   });
                }
                df.resolve(comments);
                 
            }).bind(this), 
            (err:any) => {
                console.log(err);
                df.reject(); 
            });
            return df.promise(); 
    }

    public static NewComment()
    {

    }

    public static DeleteComment()
    {

    }

    public static formatDate(netdate:string):string
    {
        var year = netdate.substr(0,4);
        var month = netdate.substr(5,2);
        var day = netdate.substr(8,2);
        return day + "." + month + "." + year;
    }
}

export class Suggestion
{  
    public Id:number;  
    public Adresse:string; 
    public Avdeling:string;
    public Created:string;
    public Epostadresse:string;
    public ForslagTilLosning:string; 
    public ForslagStatus:string;
    public ForslagType:ITaxonomyTerm
    public Kommune:string;
    public Kommunenummer:string; 
    public Konkurransereferanse:string; 
    public Likes:number; 
    public Modified:string; 
    public NarmesteLeder:IUser; 
    public Navn:IUser; 
    public NyttigForAndre:string; 
    public Postnummer:string; 
    public Saksbehandler:IUser; 
    public Tags:Array<ITaxonomyTerm>; 
    public Telefon:string; 
    public Utfordring:string; 
    public Virksomhet:string;     
    public ModifiedBy:string; 
    public AntallKommentarer:string;    
    public Attachments:boolean

    constructor(item_id?:number)
    {
        if(item_id == undefined)
        {
            this.Id = -1; 
            return;
        }
        
        this.Id = item_id;      
    }
}

/* Suggestions.cs 
   Description: Static manager class for suggestions. Wrapper for async loading.  
*/
export class Suggestions {

    public static GetById(id:number):JQueryPromise<Suggestion>
    {
        var deferred = $.Deferred();
        var suggestions = Suggestions.GetByQuery(
            "<View><Query><Where><Eq><FieldRef Name='ID'  /><Value Type='Number'>"+id+"</Value></Eq></Where></Query></View>")
            .then( (res) => {
                deferred.resolve(res[0]);  
            });                
        return deferred.promise(); 
        
    }
    public static GetAll():JQueryPromise<Array<Suggestion>>
    {
        return Suggestions.GetByQuery(""); 
    }

    public static GetByQuery(CAMLQuery:string):JQueryPromise<Array<Suggestion>>
    { 
        var deferred = $.Deferred(); 
        var fArr = new Array<Suggestion>();
        var query = new SP.CamlQuery();        
        query.set_viewXml(CAMLQuery);
        
        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle('Forslag');
        var items = oList.getItems(query);
        clientContext.load(items);
        clientContext.executeQueryAsync(
        () => 
        {
        if (items.get_count() <= 0) {
            deferred.resolve(fArr);
            return;  
        }
        var enumerator = items.getEnumerator();        
        while (enumerator.moveNext()) 
        {
            var listItem = enumerator.get_current();
            var f = new Suggestion(listItem.get_item("ID"));
            
            // Init default values
            f.Navn = { DisplayName:"", LoginName:"", Id:-1 };
            f.NarmesteLeder = { DisplayName:"", LoginName:"", Id:-1 };
            f.ForslagType = { Id:"", Title:"" };
            f.Tags = new Array<ITaxonomyTerm>();
            
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
                f.Tags = Array<ITaxonomyTerm>();
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
        deferred.resolve(fArr);
            
        
    }, function(sender, args) 
    {
        console.log(args.get_message());
        deferred.reject(args);
    }); 

    var promiseResult = deferred.promise();
    return promiseResult; 
}

     formatDate(netdate:string):string
    {
        var year = netdate.substr(0,4);
        var month = netdate.substr(5,2);
        var day = netdate.substr(8,2);
        return day + "." + month + "." + year;
    }

}
