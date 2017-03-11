/**
 * Generic proxy data-adapter 
 * Calls every function in the specific adapter. All adapters must implement all these functions. 
 */
import { Suggestion } from "./Suggestion"; 
import { Comment } from "./Comment";
import { Status }from "./Status";
import { Person } from "./Person"; 
import { SPDataAdapter } from "./SPDataAdapter"; 
let adapter = SPDataAdapter; 

export class DataAdapter
{
    /**
     * Upload image
     * Returns: Uploaded image path
     */
    uploadImage(buffer:any, filename:string):JQueryPromise<any>
    {
        return adapter.uploadImage(buffer, filename);        
    }
    /**
     * Get all suggestions
     * Param: (optional) SuggestionType 
     * Returns: Array with all suggestions, sorted by date. 
     */
    getAllSuggestions(type?:Status, top?:number):JQueryPromise<Array<Suggestion>>
    {       
        if(top != null)
            return adapter.getAllSuggestions(type, top, null);
        
        
        return adapter.getAllSuggestions(type, null, null);        
    }

    /**
     * Get my suggestions
     * Gets all suggestions submitted by user 
     */
    getMySuggestions():JQueryPromise<Array<Suggestion>>
    {
        return adapter.getMySuggestions(); 
    }

    /**
     * Get suggestion by title (Search for suggestions)
     */
    getSuggestionByTitle(title:string)
    {
        return adapter.getSuggestionByTitle(title);
    }

    /**
     * Get suggestion by id     
     */
     getSuggestionById(id:string)
     {
         return adapter.getAllSuggestions(null, 1, "&$filter=Id eq " + id); 
     }

    /**
     * Get user profile 
     * Retrieves any avilable fields for the Person-object. 
     */
     getMyUserProfile():JQueryPromise<Person>
     {
         return adapter.getMyUserProfile(); 
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
    submitCommentForSuggestion(text:string, suggestion:Suggestion):JQueryPromise<Suggestion>
    {
        return adapter.submitCommentForSuggestion(text, suggestion); 
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
     * Get city and county code 
     * @return {JQueryPromise<Promise>} A person-object with City and CountyCode filled out
     */
    getCityAndCountryCode(person:Person):JQueryPromise<Person>
    {
        return adapter.getCityAndCountryCode(person); 
    }
}