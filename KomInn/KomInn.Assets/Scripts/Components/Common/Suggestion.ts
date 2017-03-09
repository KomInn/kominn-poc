/**
 * Data model for suggestions
 */

// TODO: Endre navn fra Person til Text 
import { Comment } from "./Comment";
import { Location }from "./Location"; 
import { Person } from "./Person"; 
import { Status } from "./Status"; 
export class Suggestion 
{
    public Id:number;  // List item ID
    public Title:string;
    public Summary:string; 
    public Challenges:string; 
    public SuggestedSolution:string; 
    public InspiredBy:Suggestion; 
    public Likes:number;     
    public Image:string; 
    public Location:Location;     
    public UsefulForOthers:string; 
    public UsefulnessType:string; 
    public Submitter:Person; 
    public NumberOfComments:number;     
    public Comments:Array<Comment>;
    public Tags:Array<string>;
    public Status:Status; 
    public Created:Date; 
    
    constructor()
    {
        this.Id = -1; 
        this.Comments = new Array<Comment>(); 
        this.Likes = 0;  
        this.Submitter = new Person();               
    }
}