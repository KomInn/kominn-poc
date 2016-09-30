///<reference path="../typings/globals/sharepoint/index.d.ts" /> 
import * as React from "react";
import * as $ from "jquery";
import  {Suggestion, Suggestions, Like, UserProfile, IUser, ITaxonomyTerm, Comment, Comments } from "./SPTools"

interface ViewSuggestionData { Suggestion?:Suggestion, LikeEventHandler?():void, Like?:Like, NewCommentAddedHandler?(newcomment:Comment):void  }
export class ViewSuggestion extends React.Component<void, ViewSuggestionData>
{
    private self:IUser;     
    constructor()
    {
        super();        
        this.state = { Suggestion:new Suggestion(), Like:new Like(null) };
        this.self = { DisplayName:"", LoginName:"", Id:_spPageContextInfo.userId }                 
    }

    componentWillMount()
    {
        var suggestionId:number = -1; 
        var sId = GetUrlKeyValue("ref");
        if(sId == "")
            sId = "23"; // DEBUG ONLY, TODO:REMOVE

        suggestionId = parseInt(sId);

        Suggestions.GetById(suggestionId).done( ((res:Suggestion) => 
        {
            this.setState({Suggestion:res});
            Like.LoadForSuggestion(res).done( ((like:Like) => {
                this.setState({Like:like});
            }).bind(this));
        }).bind(this)
        );
    }

    render()
    {
        if(this.state.Suggestion.Id == -1)
            return <div></div>
    return (
            <div>
                <SuggestionDataView Suggestion={this.state.Suggestion} LikeEventHandler={this.HandleLikeClick.bind(this)} Like={this.state.Like} />
                <SuggestionComments Suggestion={this.state.Suggestion} />
            </div>
            )
    }

    HandleLikeClick()
    {
       this.state.Like.LikeUnlike().done( (numLikes:number) => {           
           this.state.Suggestion.Likes = numLikes; 
           this.setState({Suggestion:this.state.Suggestion});
       }).fail( (err:any) => {
           console.log(err); 
       }); 
    }
}

class SuggestionDataView extends React.Component<ViewSuggestionData, {}>
{
    render() {
        console.log(this.props.Suggestion);
        return (
            <div className="row">
                <div className="col-xs-12 col-md-6">
                    <SuggestionDataHeader Text="Forslag" Display="" />
                    <SuggestionDataRow Text="Forslagsstiller:" Display={this.props.Suggestion.Navn.DisplayName} />
                    <SuggestionDataRow Text="Kommune:" Display={this.props.Suggestion.Kommune} />
                    <SuggestionDataRow Text="Type:" Display={this.props.Suggestion.ForslagType.Title} />
                    <SuggestionDataRow Text="Utfordring:" Display={this.props.Suggestion.Utfordring} />
                    <SuggestionDataRow Text="Nyttig for andre?:" Display={this.props.Suggestion.NyttigForAndre} />                    
                    <SuggestionDataRow Text="Forslag til løsning:" Display={this.props.Suggestion.ForslagTilLosning} />
                    <hr/>
                    <SuggestionDataViewFooter Suggestion={this.props.Suggestion} LikeEventHandler={this.props.LikeEventHandler} Like={this.props.Like} />
                    </div> 
                    <div className="col-md-6">
                    </div>               
            </div>
            )
    }
} 

class SuggestionDataViewFooter extends React.Component<ViewSuggestionData, {}>{
    
    handleLikeClick()
    {
        this.props.LikeEventHandler();
    }

    renderLikes()
    {
        if(this.props.Suggestion.Likes <= 0)
            return <div></div>

        var likes = this.props.Suggestion.Likes;
        return <div className="col-xs-4 likes"><span className="glyphicon glyphicon-thumbs-up"></span>{this.props.Suggestion.Likes}</div>
    }


    renderTags()
    {
              if(this.props.Suggestion.Tags.length <= 0)
                return (
                 <div></div>
             );

             return (
            <div className="col-xs-4 tags">                            
                <ul>
                {this.props.Suggestion.Tags.map( (value:ITaxonomyTerm, index:number) => {                   
                    return <li><span className="glyphicon glyphicon-tag"></span>{value.Title}</li>
                })}
                </ul>
            </div>)
    }

    renderLikebutton()
    {
        if(!this.props.Like.Loaded || this.props.Like.Processing)
            return <div className="btn-xs btn-like"></div>
        
        var btnType = (this.props.Like.UserLikesThis) ? "btn-primary disabled" : "btn-success"; 
        var text = (this.props.Like.UserLikesThis) ? "Du liker dette" : "Godt forslag!"
        return (
                    <div className="likebutton col-xs-4">
                        <div className={`btn-xs btn-like ${btnType}`} onClick={this.handleLikeClick.bind(this)}><span className="glyphicon glyphicon-thumbs-up"></span>
                        {text}
                        </div>
                    </div>
        );
    }

    render()
    {
        return ( 
            <div className="row">
                <div className="dataviewfooter">                                       
                    {this.renderLikebutton()}                                   
                    {this.renderLikes()}                   
                    {this.renderTags()}
                </div>
            </div>
            
        )
    }
}

interface ViewDataField { Text:string, Display:string }
class SuggestionDataHeader extends React.Component<ViewDataField, {}>
{
    render() {
        return (
        <div className="row">
            <div className="col-xs-12">
                <header><h4>{this.props.Text}</h4></header>
            </div>
        </div>)
    }
}

class SuggestionDataRow extends React.Component<ViewDataField, {}>
{
    render() {
        return (
        <div className="row">
            <div className="col-xs-12">
                <label>{this.props.Text}</label> {this.props.Display}
            </div>
        </div>)
    }
}


interface CommentsState { Comments?:Array<Comment> }
interface CommentsProps { Comments?:Array<Comment> }
class SuggestionComments extends React.Component<ViewSuggestionData, CommentsState>
{
    constructor() {
        super();
        this.state = { Comments:new Array<Comment>()};
    }
    componentWillMount()
    {
          Comments.AllComments(this.props.Suggestion).done( ((result:Array<Comment>) =>
          {    
              this.setState({Comments:result});
          }).bind(this));
    }
    newCommentAddedHandler(newcomment:Comment)
    {
        console.log(newcomment);
        var comments = this.state.Comments;        
        comments.unshift(newcomment);        
        this.setState({Comments:comments}); 
    } 
  

render() {    
        return (<div className="row">
            <div className="col-xs-12 col-md-6"> 
            <hr/>
            <NewCommentBox Suggestion={this.props.Suggestion} NewCommentAddedHandler={this.newCommentAddedHandler.bind(this)} />
            <CommentsList Comments={this.state.Comments}  />
        </div></div>)       
    }
} 
interface NewCommentState { Comment?:Comment, ShowNewComment?:boolean, Sending?:boolean }
class NewCommentBox extends React.Component<ViewSuggestionData, NewCommentState>
{
    constructor()
    {
        super();
        this.state = { Comment:{Text:""}, ShowNewComment:false, Sending:false }
    }
    handleTextChanged(e:any) {
        this.state.Comment.Text = e.target.value;
        this.setState({Comment:this.state.Comment});            
    } 

    handleShowNewComment(e:any)
    {
        this.setState({ShowNewComment: !this.state.ShowNewComment });
    } 
 
    saveNewComment()
    {
        this.setState({Sending:true}, (() => 
        {
                Comments.NewComment(this.state.Comment.Text, this.props.Suggestion.Id).done( ((comment:Comment)=> 
                {
                    this.props.NewCommentAddedHandler(comment);
                    var c = this.state.Comment;
                    c.Text = ""; 
                    this.setState({Comment:c});
                    this.setState({ShowNewComment:false});
                    this.setState({Sending:false})
                }).bind(this));        
        }).bind(this));
       
    }

    render()
    {

        if(this.state.Sending)
            return <div className="row"><div className="col-xs-12"><label>Vennligst vent...</label></div></div>;

        if(!this.state.ShowNewComment)
        return (
            <div className="row newcomment">
                <div className="col-xs-12">
                <div className="btn-xs btn-like btn-success btn-newcomment" onClick={this.handleShowNewComment.bind(this)}>Ny kommentar</div>
                </div>
            </div>
        )

        return (
            <div className="newcomment">
                <div className="row"> 
                    <div className="col-xs-12">
                    <label>Skriv kommentar</label>
                    <textarea value={this.state.Comment.Text} onChange={this.handleTextChanged.bind(this)}></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="btn-xs btn-success btn-send" onClick={this.saveNewComment.bind(this)}>Send</div>
                    </div>
                </div>
            </div>
        );
    }
}




class CommentsList extends React.Component<CommentsProps, {}>
{     
    render()
    {
        console.log(this.props);
        return (
            <div className="row comments">
                <div className="col-xs-12">
                { this.props.Comments.map( ((item:Comment, index:number) => {
                    return <CommentItem comment={item} />                    
                }).bind(this)) }
                    
                </div>            
            </div>
        );
    }
}

interface CommentState { ImageUrl:string }
interface CommentProps { comment:Comment  }

class CommentItem extends React.Component<CommentProps, CommentState>
{        
    constructor()
    {
        super();
        this.state = { ImageUrl:"" };         
    }
    componentWillMount(){
        UserProfile.GetProfileImageFor(this.props.comment.Person.LoginName)
            .done( ((result:any) => 
            {                          
                if(result == undefined)
                    return;                                                       
                this.setState({ImageUrl:result});   
        }).bind(this)); 
    }

    RenderProfileImage() 
    {
        if(this.state.ImageUrl != null && this.state.ImageUrl.length > 0)
            return <img src={this.state.ImageUrl} className="profilepicture"/>

        return <span className="glyphicon glyphicon-user profilepicture"></span>
    } 

    render() 
    {         
    return (<div className="comment">
                        <div className="row">
                            <div className="col-xs-2">                        
                            {this.RenderProfileImage()} 
                            </div>
                            <div className="col-xs-10">
                                <h4>{this.props.comment.Person.DisplayName}</h4>
                                <div>{this.props.comment.Text.split("\n").map( (item) => {
                                    return (<span>{item}<br/></span>);
                                    })}
                                </div>
                                <div className="datefooter">
                                    {this.props.comment.Timestamp}
                                </div>
                            </div>
                        </div>
                    </div>);
    }
}


