/* SPTools.tsx
   Description: Data handler adapters for solution data management. 
*/

$.ajaxSetup({ headers: { "Accept": "application/json;odata=verbose" } })

/* Global interfaces */
export enum SortTypes { Newest, Oldest, Comments, Likes };
export enum SuggestionViewDisplayMode { "Brief", "Detailed" };
export enum SuggestionType { "Submitted", "SuccessStories" };
export interface IUser {
    DisplayName?: string,
    LoginName?: string,
    Id?: number
}

export interface ITaxonomyTerm {
    Title?: string,
    Id?: string
}

export interface IUserProfileProperty {
    Key?: string,
    Value?: string,
    ValueType?: string
}

export interface ISPUserProfile {
    AccountName?: string;
    DisplayName?: string;
    Email?: string;
    PictureUrl?: string;
    UserProfileProperties: UserProfilePropertyArray<IUserProfileProperty>
}
 
interface UserImage { ImageUrl: string, Username: string }

class UserProfilePropertyArray<T> extends Array<any>
{ 
    public findByKey(key: string): T {
        console.log("Finding" + key); 
        for (var i = 0; i < this.length; i++) {
            if (this[i].Key == key)
            {
                console.log("found key"); 
                return this[i];
            }
        }  
        console.log("Returning default"); 
        let def:IUserProfileProperty = {Value:"", ValueType:"", Key:"" };
        console.log(def);
        console.log("TEST");
        return def as T;   
    }
}

export class UserProfile {
    public static ensureUser(username: string): JQueryPromise<any> {
        var df = $.Deferred();
        var payload = { 'logonName': username };
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(payload),
            headers: {
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "accept": "application/json;odata=verbose"
            }
        }).then((data: any) => { df.resolve(data); })
            .fail((err: any) => {
                df.reject();
            });
        return df.promise();
    }
    // Returns the profile picture URL for the specified user
    public static GetProfileImageFor(username: string): JQueryPromise<string> {
        var df = $.Deferred();
        UserProfile.ensureUser(username)
            .done((user: any) => {
                $.get(_spPageContextInfo.webAbsoluteUrl +
                    "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(accountname=@v)?@v='" + user.d.LoginName.replace("#", "%23") + "'")
                    .done((res: any) => {
                        df.resolve(res.d.PictureUrl);
                    })
            });
        return df.promise();
    }


    public static GetIUserById(id: number): JQueryPromise<IUser> {
        var df = $.Deferred();
        let user: IUser;

        $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + id + ")")
            .done((result: any) => {
                user = {
                    DisplayName: result.d.Title,
                    Id: result.d.Id,
                    LoginName: this.CleanLoginName(result.d.LoginName)
                }
                df.resolve(user);
            })
            .fail((err: any) => {
                console.log("Failed to retrieve user by id");
                df.reject();
            });
        return df.promise();
    }

    private static CleanLoginName(loginname: string): string {
        return encodeURIComponent(loginname);
    }

    public static GetMyProperties(): JQueryPromise<ISPUserProfile> {
        var df = $.Deferred();
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/getmyproperties",
            type: "GET",
            headers: { "Accept": "application/json;odata=verbose" },
            success: (result: any) => {
                var upsArr = new UserProfilePropertyArray<IUserProfileProperty>();
                var props = result.d.UserProfileProperties.results;
                for (var i = 0; i < props.length; i++) {
                    var newItem: IUserProfileProperty = {
                        Key: props[i].Key,
                        Value: props[i].Value,
                        ValueType: props[i].ValueType
                    }
                    upsArr.push(newItem);
                }
                result.d.UserProfileProperties = upsArr;
                df.resolve(result.d);

            },
            error: (err: any) => { df.reject(); }
        });
        return df.promise();
    }
}

export class Taxonomy {
    public static GetTaxonomyArray(termset: string, language: number): JQueryPromise<Array<ITaxonomyTerm>> {
        var df = $.Deferred();
        var context = SP.ClientContext.get_current();
        var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        var termStore = taxSession.getDefaultSiteCollectionTermStore();
        termStore.updateCache();


        context.load(termStore);
        context.executeQueryAsync(s.bind(this), f.bind(this))
        function f() { console.log("Cache update failed."); }

        function s() {
            var termSets = termStore.getTermSetsByName(termset, language);
            var termSet = termSets.getByName(termset);
            var terms = termSet.getAllTerms();
            context.load(terms);
            context.executeQueryAsync(success.bind(this), fail.bind(this));


            function success(sender: any, args: any) {

                var retrievedTerms = new Array<ITaxonomyTerm>();
                var termEnumerator = terms.getEnumerator();
                while (termEnumerator.moveNext()) {
                    var term = termEnumerator.get_current();

                    retrievedTerms.push({
                        Title: term.get_name(),
                        Id: term.get_id().toString()
                    });
                }

                df.resolve(retrievedTerms);
            }
            function fail() {
                console.log(arguments[1].get_message());
                df.reject();
            }
        }

        return df.promise();
    }
}

export class ListData {
    public static getDataFromList(listName: string, odata: string): JQueryPromise<any> {
        return $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/Items" + odata)
            .then((data: any) => { return data });
    }
}

export class Like {
    public Loaded: boolean; // No like / unlike operations can take place before object is loaded. 
    public Processing: boolean; // While processing, no like/unlike operations can take place. 
    public UserLikesThis: boolean;

    private LikeListItemId: number;
    private SuggestionItem: Suggestion;
    constructor(suggestion: Suggestion) {
        if (suggestion == null)
            return;

        this.SuggestionItem = suggestion;
        this.UserLikesThis = false;
        this.Loaded = false;
        this.Processing = false;
    }

    public static Load(suggestion: Suggestion): JQueryPromise<Like> {
        var df = $.Deferred();
        ListData.getDataFromList("Likerklikk",
            "?$select=*,Forslag/Id,Person/Id&$expand=Forslag,Person&$filter=Forslag/Id eq " + suggestion.Id + " and Person/Id eq " + _spPageContextInfo.userId)
            .done(((d: any) => {
                var like = new Like(suggestion);
                like.Loaded = true;
                if (d.d.results.length <= 0) {
                    df.resolve(like);
                    return;
                }
                like.UserLikesThis = true;
                like.setLikeListItemId(d.d.results[0].Id);
                df.resolve(like);
            }).bind(this));
        return df;
    }

    public LikeUnlike(): JQueryPromise<number> {
        if (this.UserLikesThis)
            return this.Unlike();
        else
            return this.Like();

    }

    public setLikeListItemId(id: number) {
        this.LikeListItemId = id;
    }

    // Returns: number of likes
    private Like(): JQueryPromise<number> {
        var df = $.Deferred();
        if (this.Processing) {
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
        context.executeQueryAsync(((result: any) => {
            this.SuggestionItem.Likes += 1;
            this.UpdateLikeCountInList().done(() => {
                this.LikeListItemId = item.get_id();
                this.UserLikesThis = true;
                this.Processing = false;
                df.resolve(this.SuggestionItem.Likes);
            })
        }).bind(this),
            (err: any) => {
                console.log(err);
                df.reject(err);
            });

        return df.promise();
    }

    // Returns: number of likes
    private Unlike(): JQueryPromise<number> {
        var df = $.Deferred();
        if (this.Processing || !this.UserLikesThis) {
            df.reject();
            return df.promise();
        }
        this.Processing = true;

        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle("Likerklikk");
        var item = list.getItemById(this.LikeListItemId);
        item.deleteObject();
        context.executeQueryAsync(((r: any) => {
            this.SuggestionItem.Likes -= 1;
            this.UpdateLikeCountInList().then(() => {
                this.UserLikesThis = false;
                this.Processing = false;
                df.resolve(this.SuggestionItem.Likes);
            })
        }).bind(this),
            (err: any) => {
                df.reject(err);
            });
        return df.promise();
    }

    private UpdateLikeCountInList(): JQueryPromise<{}> {
        var df = $.Deferred();
        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle("Forslag");
        var item = list.getItemById(this.SuggestionItem.Id);


        item.set_item("Likes", this.SuggestionItem.Likes);
        item.update();
        context.executeQueryAsync(((r: any) => {
            df.resolve();
        }).bind(this),
            (err: any) => {
                console.log(err);
                df.reject(err);
            });

        return df.promise();
    }
}

export interface Comment { Text?: string, Person?: IUser, Timestamp?: string, Image?: string, Role?: string };
export class Comments {
    public static AllComments(suggestion: Suggestion): JQueryPromise<Array<Comment>> {
        var df = $.Deferred();
        ListData.getDataFromList("Kommentarer",
            "?$select=Kommentar,Forslag/Id,Person/Title,Created,Person/Id,Person/UserName&$expand=Forslag,Person&$filter=Forslag/Id eq " + suggestion.Id + "&$orderby=Created desc")
            .done((commentsRetrievedSuccessfulHandler).bind(this))
            .fail(commentsRetrievalFailedHandler);

        function commentsRetrievedSuccessfulHandler(d: any) {
            var comments = new Array<Comment>();
            for (var i = 0; i < d.d.results.length; i++) {
                let item = d.d.results[i];
                comments.push({
                    Text: item.Kommentar,
                    Person: {
                        DisplayName: item.Person.Title,
                        LoginName: item.Person.UserName,
                        Id: item.Person.Id
                    },
                    Timestamp: formatDate(item.Created),
                    Image: ""
                });
            }
            df.resolve(comments);
        }

        function commentsRetrievalFailedHandler(err: any) {
            console.log(err);
            df.reject();
        }

        return df.promise();
    }



    // Determine role based on retriever data from roledata. 
    private static DetermineRole(userId: number, roleData: any): string {
        var role = "Ansatt";
        if (roleData.d.results.length <= 0)
            return role;

        var roleItem = roleData.d.results[0];

        if (userId == roleItem.Navn.Id)
            role = "Forslagsstiller";

        if (roleItem.Saksbehandler.hasOwnProperty("Id")) {
            if (userId == roleItem.Saksbehandler.Id)
                role = "Saksbehandler";

        }
        return role;

    }

    public static NewComment(text: string, suggestionListItemId: number): JQueryPromise<Comment> {
        var df = $.Deferred();
        if (text.length <= 0 || text == undefined) {
            df.reject();
            return;
        }

        // Retrieve role
        ListData.getDataFromList("Forslag", "?$select=Created,Id,Navn/Id,Saksbehandler/Id&$expand=Navn,Saksbehandler&$filter=Id eq " + suggestionListItemId).done(
            ((roleData: any) => {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Kommentarer");
                var itemcreationinfo = new SP.ListItemCreationInformation();
                var item = list.addItem(itemcreationinfo);
                var userId = _spPageContextInfo.userId;

                item.set_item("Kommentar", text);
                var person = new SP.FieldUserValue();
                person.set_lookupId(_spPageContextInfo.userId);
                item.set_item("Person", person);

                var relSuggestionField = new SP.FieldLookupValue();
                relSuggestionField.set_lookupId(suggestionListItemId);
                item.set_item("Forslag", relSuggestionField);

                var rolle = this.DetermineRole(userId, roleData);
                item.set_item("Rolle", rolle);
                item.update();

                this.incrementNumCommentsOnSuggestionList(suggestionListItemId)
                    .done(() => {

                        context.load(item);
                        context.executeQueryAsync(
                            (result: any) => {
                                // Get own properties 
                                UserProfile.GetIUserById(userId)
                                    .done((user: IUser) => {
                                        let comment: Comment =
                                            {
                                                Person: user,
                                                Role: rolle,
                                                Text: text,
                                                Timestamp: item.get_item("Created").format('dd.MM.yyyy'),
                                                Image: ""
                                            }
                                        df.resolve(comment);
                                    });
                            },
                            (err: any) => {
                                console.log(err);
                                df.reject(err);
                            });
                    });
            }));


        return df.promise();
    }

    public static incrementNumCommentsOnSuggestionList(listitem_id: number): JQueryPromise<{}> {
        var df = $.Deferred();
        var comments = this.AllComments(new Suggestion(listitem_id)).done((result: Array<Comment>) => {
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("Forslag");
            var item = list.getItemById(listitem_id);

            item.set_item("AntallKommentarer", result.length + 1);
            item.update();
            context.executeQueryAsync(
                ((r: any) => {
                    df.resolve();
                }).bind(this),
                (err: any) => {
                    console.log(err);
                    df.reject(err);
                });
        });

        return df.promise();
    }
}

export class Suggestion {
    public Id: number;
    public Title: string;
    public Adresse: string;
    public Avdeling: string;
    public Created: string;
    public Epostadresse: string;
    public ForslagTilLosning: string;
    public ForslagStatus: string;
    public ForslagType: ITaxonomyTerm;
    public Kommune: string;
    public Kommunenummer: string;
    public Konkurransereferanse: string;
    public Likes: number;
    public Modified: string;
    public NarmesteLeder: IUser;
    public Navn: IUser;
    public NyttigForAndre: string;
    public Postnummer: string;
    public Saksbehandler: IUser;
    public Tags: Array<ITaxonomyTerm>;
    public Telefon: string;
    public Utfordring: string;
    public Virksomhet: string;
    public ModifiedBy: string;
    public AntallKommentarer: number;
    public Attachments: boolean
    public Dato: string;

    constructor(item_id?: number) {
        this.ForslagType = { Id: null, Title: null };
        this.NarmesteLeder = { DisplayName: null, Id: null, LoginName: null };
        this.Navn = { DisplayName: null, Id: null, LoginName: null };
        this.Id = -1;
        this.Title = "";
        this.Adresse = "";
        this.Avdeling = "";
        this.Created = "";
        this.Epostadresse = "";
        this.ForslagTilLosning = "";
        this.ForslagStatus = "";
        this.Kommune = "";
        this.Kommunenummer = "";
        this.Likes = 0;
        this.Modified = "";
        this.NyttigForAndre = "";
        this.Postnummer = "";
        this.Saksbehandler = { DisplayName: null, Id: null, LoginName: null };
        this.Telefon = "";
        this.Utfordring = "";
        this.Virksomhet = "";
        this.ModifiedBy = "";
        this.AntallKommentarer = 0;
        this.Attachments = false;
        this.Dato = "";
        if (item_id != undefined)
            this.Id = item_id;
    }

    public Save(): JQueryPromise<{}> {
        var df = $.Deferred();
        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle("Forslag");
        var itemcreationinfo = new SP.ListItemCreationInformation();
        var item = list.addItem(itemcreationinfo);
        item.set_item("Title", this.Title);
        item.set_item("Adresse", this.Adresse);
        item.set_item("Avdeling", this.Avdeling);
        item.set_item("E_x002d_postadresse", this.Epostadresse);
        item.set_item("Forslag_x0020_til_x0020_l_x00f8_", this.ForslagTilLosning);
        item.set_item("ForslagStatus", "Sendt inn");
        item.set_item("Kommune", this.Kommune);
        item.set_item("Kommunenummer", this.Kommunenummer);
        item.set_item("Konkurransereferanse", this.Konkurransereferanse);
        item.set_item("Nyttig_x0020_for_x0020_andre_x00", this.NyttigForAndre);
        item.set_item("Postnummer", this.Postnummer);
        item.set_item("Telefon", this.Avdeling);
        item.set_item("Utfordring", this.Utfordring);
        item.set_item("Virksomhet", this.Virksomhet);

        if(this.NarmesteLeder != null && this.NarmesteLeder.Id != null)
        {
            var manager = new SP.FieldUserValue();
            manager.set_lookupId(this.NarmesteLeder.Id);
            item.set_item("N_x00e6_rmeste_x0020_leder", manager);
        }

        var self = new SP.FieldUserValue();
        self.set_lookupId(_spPageContextInfo.userId);
        item.set_item("Navn", self);

        if (this.ForslagType.Id != null && this.ForslagType.Id.length > 0) {
            var taxSingle = new SP.Taxonomy.TaxonomyFieldValue();
            taxSingle.set_termGuid(new SP.Guid(this.ForslagType.Id));
            taxSingle.set_label(this.ForslagType.Title);
            taxSingle.set_wssId(-1);
            item.set_item("ForslagType", taxSingle);
        }
        item.update();
        context.load(item);
        context.executeQueryAsync(success.bind(this), fail);

        function success(d: any) {

            df.resolve();
        }

        function fail(d: any, args: any) {
            console.log(args.get_message());
            df.reject(args.get_message());
        }
        return df.promise();
    }

    private findProperty(property:string, props:UserProfilePropertyArray<IUserProfileProperty>):string
    {
         for (var i = 0; i < props.length; i++) {
            if (props[i].Key == property)
            {                
                return props[i].Value;
            }
        }  
    }

    public PopulateFromUserProfile(): JQueryPromise<Suggestion> {

        var df = $.Deferred();
        UserProfile.GetMyProperties()
            .done((results: ISPUserProfile) => {
                var props: UserProfilePropertyArray<IUserProfileProperty> = results.UserProfileProperties
                this.Adresse = this.findProperty("Office", props);
                this.Avdeling = this.findProperty("SPS-JobTitle", props);
                this.Epostadresse = this.findProperty("WorkEmail", props);
                this.Telefon = this.findProperty("CellPhone", props );
                this.Virksomhet = this.findProperty("Department", props);
                this.Dato = this.getTodaysDate();
                this.Konkurransereferanse = GetUrlKeyValue("ref");

                UserProfile.GetMyProperties()
                    .done((self: any) => {
                        this.Navn = {
                            DisplayName: self.DisplayName,
                            LoginName: self.AcountName,
                            Id: _spPageContextInfo.userId
                        }
                        var manager = this.findProperty("Manager", props);                         
                        if (manager != null && manager != "") 
                        {                        
                            UserProfile.ensureUser(manager)
                                .done((result: any) => {
                                    this.NarmesteLeder = {
                                        DisplayName: result.d.Title,
                                        LoginName: result.d.LoginName,
                                        Id: result.d.Id
                                    }
                                    df.resolve(this);
                                });
                        } else
                            df.resolve(this);
                    });
            });

        return df.promise();
    }

    private getTodaysDate() {
        var d = new Date();
        return d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
    }
}



export class Suggestions {

    public static GetById(id: number): JQueryPromise<Suggestion> {
        var deferred = $.Deferred();
        var suggestions = Suggestions.GetByQuery(
            "<View><Query><Where><Eq><FieldRef Name='ID'  /><Value Type='Number'>" + id + "</Value></Eq></Where></Query></View>")
            .then((res) => {
                deferred.resolve(res[0]);
            });
        return deferred.promise();

    }
    public static GetAll(): JQueryPromise<Array<Suggestion>> {
        return Suggestions.GetByQuery("");
    }

    public static GetByQuery(CAMLQuery: string): JQueryPromise<Array<Suggestion>> {
        var deferred = $.Deferred();
        var fArr = new Array<Suggestion>();
        var query = new SP.CamlQuery();
        query.set_viewXml(CAMLQuery);

        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle('Forslag');
        var items = oList.getItems(query);
        clientContext.load(items);
        clientContext.executeQueryAsync(
            () => {
                if (items.get_count() <= 0) {
                    deferred.resolve(fArr);
                    return;
                }

                var enumerator = items.getEnumerator();
                while (enumerator.moveNext()) {
                    var listItem = enumerator.get_current();
                    var f = new Suggestion(listItem.get_item("ID"));
                    // Init default values
                    f.Navn = { DisplayName: "", LoginName: "", Id: -1 };
                    f.NarmesteLeder = { DisplayName: "", LoginName: "", Id: -1 };
                    f.ForslagType = { Id: "", Title: "" };
                    f.Tags = new Array<ITaxonomyTerm>();
                    // Navn SPUser
                    let navnField: SP.FieldUserValue = listItem.get_item('Navn');
                    if (navnField != null) {
                        f.Navn = {
                            DisplayName: navnField.get_lookupValue(),
                            LoginName: "",
                            Id: navnField.get_lookupId()
                        };
                    }

                    // Manager
                    let managerField: SP.FieldUserValue = listItem.get_item("N_x00e6_rmeste_x0020_leder");
                    if (managerField != null) {
                        f.NarmesteLeder = {
                            DisplayName: managerField.get_lookupValue(),
                            LoginName: "",
                            Id: managerField.get_lookupId()
                        };
                    }

                    // ForslagType 
                    let taxField: SP.Taxonomy.TaxonomyFieldValue = listItem.get_item("ForslagType");
                    if (taxField != null) {
                        f.ForslagType = {
                            Id: taxField.get_termGuid().toString(),
                            Title: taxField.get_label()
                        }
                    }

                    // Tags
                    let tagsField: SP.Taxonomy.TaxonomyFieldValueCollection = listItem.get_item("Tags")
                    if (tagsField != null) {
                        f.Tags = Array<ITaxonomyTerm>();
                        var allTags = tagsField.getEnumerator();
                        while (allTags.moveNext()) {
                            var cItem = allTags.get_current();

                            f.Tags.push({
                                Id: cItem.get_termGuid().toString(),
                                Title: cItem.get_label()
                            });
                        }
                    }

                    f.Title = listItem.get_item("Title");
                    f.Adresse = listItem.get_item("Adresse");
                    f.Attachments = listItem.get_item("Attachments");
                    f.Avdeling = listItem.get_item("Avdeling");
                    f.Created = listItem.get_item("Created").format("dd.MM.yyyy");
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
                    f.AntallKommentarer = listItem.get_item("AntallKommentarer");
                    if (f.AntallKommentarer == null)
                        f.AntallKommentarer = 0;
                    if (f.Likes == null)
                        f.Likes = 0;
                    fArr.push(f);
                }
                deferred.resolve(fArr);


            }, function (sender, args) {
                console.log(args.get_message());
                deferred.reject(args);
            });

        var promiseResult = deferred.promise();
        return promiseResult;
    }



    public static partitionSuggestions(suggestions: Array<Suggestion>, partitionSize: number): JQueryPromise<Array<Array<Suggestion>>> {
        var df = $.Deferred();
        var p = Array<Array<Suggestion>>();
        var partition = new Array<Suggestion>();
        for (var i = 0; i < suggestions.length; i++) {
            partition.push(suggestions[i]);
            if (partition.length == partitionSize) {
                p.push(partition);
                partition = new Array<Suggestion>();
            }
        }
        if (partition.length > 0)
            p.push(partition);

        df.resolve(p);
        return df.promise();
    }
}

/* Global functions */
function formatDate(netdate: string): string {
    var year = netdate.substr(0, 4);
    var month = netdate.substr(5, 2);
    var day = netdate.substr(8, 2);
    return day + "." + month + "." + year;
}