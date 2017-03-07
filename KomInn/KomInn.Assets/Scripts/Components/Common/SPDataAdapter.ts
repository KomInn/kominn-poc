/**
 * SPDataAdapter 
 * 
 * Data transmission and retrieval functions for interfacing SharePoint on-prem or in the cloud
 */

import { Suggestion } from "./Suggestion"; 
import { Comment } from "./Comment";
import { SuggestionType }from "./SuggestionType";

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
     * Param: (optional) SuggestionType 
     * Returns: Array with all suggestions, sorted by date. 
     */
    static getAllSuggestions(type?:SuggestionType):JQueryPromise<Array<Suggestion>>
    {
        return null; 
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