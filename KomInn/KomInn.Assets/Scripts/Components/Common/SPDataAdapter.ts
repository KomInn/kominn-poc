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
    /**
     * Submit suggestions
     * Returns: (Suggestion) The submitted suggestion
     */
    static submitSuggestion(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return null; 
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
