/**
 * Generic proxy data-adapter 
 * Calls every function in the specific adapter. All adapters must implement all these functions. 
 */
import { Suggestion } from "./Suggestion"; 
import { Comment } from "./Comment";
import { SuggestionType }from "./SuggestionType";
import { SPDataAdapter } from "./SPDataAdapter"; 
let adapter = SPDataAdapter; 

export class DataAdapter
{
    /**
     * Upload image
     * Returns: Uploaded image path
     */
    uploadImage():JQueryPromise<string>
    {
        return adapter.uploadImage();        
    }
    /**
     * Get all suggestions
     * Param: (optional) SuggestionType 
     * Returns: Array with all suggestions, sorted by date. 
     */
    getAllSuggestions(type?:SuggestionType):JQueryPromise<Array<Suggestion>>
    {        
        return adapter.getAllSuggestions(type); 
    }

    /**
     * Submit suggestions
     * Returns: (Suggestion) The submitted suggestion
     */
    submitSuggestion(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return adapter.submitSuggestion(suggestion); 
    }

    /**
     * Get comments for suggestion 
     * Returns: The suggestion with comments loaded
     */
    getCommentsForSuggestion(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return adapter.getCommentsForSuggestion(suggestion); 
    }

    /**
     * Submit comment for suggestion
     * Returns: The suggestion with the added comment
     */
    submitCommentForSuggestion(comment:Comment, suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return adapter.submitCommentForSuggestion(comment, suggestion); 
    }

    /**
     * UpdateLike for suggestion
     * Returns: The suggestion with updated like count (Suggestion)
     */
    updateLike(suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return adapter.updateLike(suggestion); 
    }

    /**
     * Gets the users profile picture
     * Returns: The users profile picture (string) 
     */
     getUserProfilePicture(url:string):JQueryPromise<string>
     {
         return adapter.getUserProfilePicture(url); 
     }
}