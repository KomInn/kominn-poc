/**
 * SPDataAdapter 
 * 
 * Data transmission and retrieval functions for interfacing SharePoint on-prem or in the cloud
 */

import { Suggestion } from "./Suggestion"; 
import { Person }from "./Person";
import { Comment } from "./Comment";
import { Status }from "./Status";
import { Tools } from "./Tools"; 
$.ajaxSetup({ headers: { "Accept": "application/json;odata=verbose" } })


interface UserProfileProperty { 
    Key:string, Value:string, ValueType:string
}


export class SPDataAdapter {
      /**
     * Upload image
     * Returns: Uploaded image path
     */
    static uploadImage():JQueryPromise<string>
    {
        var df = $.Deferred();
        
        return df.promise(); 
    }
    /**
     * Get all suggestions
     * Param: (optional) Status: Gets all with assigned status
     * Param: (optional) Count: Gets a set count
     * Returns: Array with all suggestions, sorted by date. 
     */
    static getAllSuggestions(type?:Status, count?:number, customFilter?:string):JQueryPromise<Array<Suggestion>>
    {
        var numResults = (count == null) ? 100 : count; 
        var query = (type == null) ? "" : "&$filter=Status eq '"+Tools.statusToString(type)+"'";
        if(customFilter != null)
            query = customFilter; 

        var df = $.Deferred(); 
        var suggestions = new Array<Suggestion>(); 
        $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Forslag')/Items?$top="+numResults+"&$orderby=Created desc " +query).then( (result:any) => {           

            var results = result.d.results; 
            for(var i=0;i<results.length;i++)
            {
                var p = new Person();
                var s = new Suggestion();                
                p.Name = results[i].Name; 
                p.Address = results[i].Address;
                p.City = results[i].City; 
                p.CountyCode = results[i].CountyCode; 
                p.Department = results[i].Department; 
                p.MailAddress = results[i].MailAddress; 
                p.Manager = results[i].ManagerId;
                p.Telephone = results[i].Telephone; 
                p.Zipcode = results[i].Zipcode; 
                s.Id = results[i].Id; 
                s.Challenges = results[i].Challenges; 
                s.Image = Tools.IsNull(results[i].Image) ? "" : results[i].Image;
                s.Likes = Tools.IsNull(results[i].Likes) ? 0 : results[i].Likes; 
                s.Location = results[i].Location; 
                s.NumberOfComments = Tools.IsNull(results[i].NumberOfComments) ? 0 : results[i].NumberOfComments; 
                s.Status = Tools.convertStatus(results[i].Status); 
                s.Submitter = p; 
                s.SuggestedSolution = results[i].SuggestedSolution; 
                s.Summary = results[i].Summary; 
                if(results[i].Tags != null)
                    s.Tags = results[i].Tags.results; 
                    
                s.Title = results[i].Title; 
                s.UsefulForOthers = results[i].UsefulForOthers; 
                s.UsefulnessType = results[i].UsefulnessType; 
                s.Created = new Date(results[i].Created);
                suggestions.push(s); 
            }            
            df.resolve(suggestions); 
        });
        return df.promise();
    }

    public static getMySuggestions():JQueryPromise<Array<Suggestion>>
    {
        var userId = _spPageContextInfo.userId; 
        return this.getAllSuggestions(null, null, "&$filter=AuthorId eq " + userId); 

    }

    public static getSuggestionByTitle(title:string):JQueryPromise<Array<Suggestion>>
    {
        return this.getAllSuggestions(null, null, "&$filter=substringof('"+title+"', Title)");
    }

    public static getMyUserProfile():JQueryPromise<Person>
    {
        var df = $.Deferred();         
        $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties")
        .then( (result:any) => {             
                var p = new Person();                 
                p.Id = _spPageContextInfo.userId; 
                p.ProfileImageUrl = result.d.PictureUrl; 
                p.Name = result.d.DisplayName; 
                p.Address = this.getUserProfileProperty("Office", result.d.UserProfileProperties.results); 
                p.Department = this.getUserProfileProperty("SPS-JobTitle", result.d.UserProfileProperties.results); 
                p.MailAddress = result.d.Email;
                p.Branch = this.getUserProfileProperty("Department", result.d.UserProfileProperties.results); 
                p.ManagerLoginName = this.getUserProfileProperty("Manager", result.d.UserProfileProperties.results); 
                p.Telephone = this.getUserProfileProperty("CellPhone", result.d.UserProfileProperties.results); 

                if(p.ManagerLoginName == null || p.ManagerLoginName.length <= 0)
                {
                    df.resolve(p);
                    return; 
                }

                this.ensureUser(p.ManagerLoginName).then( (result:any) => { 
                   p.Manager = new Person();
                   p.Manager.Id = result.d.Id; 
                   p.Manager.Name  = result.d.Title; 
                   df.resolve(p);
                   return;                    
                });
        }); 
        return df.promise(); 
    }

/**
 * Returns the ID of a resolved user, or -1 if not found.  
 */
    private static ensureUser(loginName:string):JQueryPromise<any>
    {
        var df = $.Deferred(); 
        var payload = {'logonName':loginName}; 
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

    private static getUserProfileProperty(property:string, userProfileProperties:Array<UserProfileProperty>):string
    {    
        for(let prop of userProfileProperties)
        {
            if(prop.Key == property)
            {
                return prop.Value; 
            }
        }  
        return "";         
        
    }

    /**
     * Submit suggestions
     * Returns: (Suggestion) The submitted suggestion
     */
    static submitSuggestion(suggestion:Suggestion):JQueryPromise<Suggestion>
    {        
        var df = $.Deferred(); 
        var s = suggestion; 
        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getByTitle("Forslag");
        var itemcreationinfo = new SP.ListItemCreationInformation();
        var item = list.addItem(itemcreationinfo);
        item.set_item("Title", s.Title );
        item.set_item("Summary", s.Summary);
        item.set_item("Challenges", s.Challenges);
        item.set_item("SuggestedSolution", s.SuggestedSolution);
        item.set_item("Location", s.Location);
        item.set_item("UsefulForOthers", s.UsefulForOthers);
        item.set_item("UsefulnessType", s.UsefulnessType);
        item.set_item("CountyCode", s.Submitter.CountyCode);
        item.set_item("Name", s.Submitter.Name);
        item.set_item("Address", s.Submitter.Address);
        item.set_item("MailAddress", s.Submitter.MailAddress);
        item.set_item("Telephone", s.Submitter.Telephone);
        item.set_item("Zipcode", s.Submitter.Zipcode);
        item.set_item("City", s.Submitter.City);
        item.set_item("Department", s.Submitter.Department);        
        item.set_item("Image", s.Image);
        item.set_item("Status", Tools.statusToString(Status.Submitted));        

        if(s.Submitter.Manager != null && s.Submitter.Manager.Id != -1)
        {
            var manager = new SP.FieldUserValue();
            manager.set_lookupId(s.Submitter.Manager.Id); 
            item.set_item("Manager", s.Submitter.Manager.Id);
        }
        if(s.InspiredBy != null)
        {
            var inspiredByField = new Array<SP.FieldLookupValue>(); 
            for(let v of s.InspiredBy)
            {
                var lookup = new SP.FieldLookupValue(); 
                lookup.set_lookupId(v.Id); 
                inspiredByField.push(lookup); 
            }
            item.set_item("InspiredBy", inspiredByField);
        }
        item.update();
        context.load(item);
        context.executeQueryAsync( 
            (success:any) => {              
                    df.resolve(s);  
            }, 
            (fail:any, error:any) => {
                df.reject(error.get_message());
            });

        return df.promise();
    }

    /**
     * Get comments for suggestion 
     * Returns: The suggestion with comments loaded
     */
    static getCommentsForSuggestion(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return null; 
    }

    /**
     * Submit comment for suggestion
     * Returns: The suggestion with the added comment
     */
    static submitCommentForSuggestion(comment:Comment, suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return null; 
    }

    /**
     * UpdateLike for suggestion
     * Returns: The suggestion with updated like count (Suggestion)
     */
    static updateLike(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return null; 
    }

    /**
     * Gets the users profile picture
     * Returns: The users profile picture (string) 
     */
     static getUserProfilePicture(url:string):JQueryPromise<string>
     {
         return null; 
     }
}
