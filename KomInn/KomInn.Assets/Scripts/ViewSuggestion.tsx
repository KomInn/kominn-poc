///<reference path="../typings/globals/sharepoint/index.d.ts" /> 
import * as React from "react";
import * as $ from "jquery";
import {Suggestion, Suggestions, Like, UserProfile, IUser, ITaxonomyTerm, Comment, Comments } from "./SPTools"

interface ViewSuggestionData { Suggestion?: Suggestion, NewCommentAddedHandler?(newcomment: Comment): void }
export class ViewSuggestion extends React.Component<void, ViewSuggestionData>
{
    private self: IUser;
    constructor() {
        super();
        this.state = { Suggestion: new Suggestion() };
        this.self = { DisplayName: "", LoginName: "", Id: _spPageContextInfo.userId }
    }

    componentWillMount() {
        var suggestionId: number = -1;
        var sId = GetUrlKeyValue("ref");
        if (sId == "") {
            window.location.href = _spPageContextInfo.webAbsoluteUrl;
        }

        suggestionId = parseInt(sId);

        Suggestions.GetById(suggestionId).done(((result: Suggestion) => {
            this.setState({ Suggestion: result });
        }).bind(this)
        );
    }

    render() {
        if (this.state.Suggestion.Id == -1)
            return <div></div>
        return (
            <div>
                <SuggestionDataView Suggestion={this.state.Suggestion} />
                <SuggestionComments Suggestion={this.state.Suggestion} />
            </div>
        )
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
                    <SuggestionDataViewFooter Suggestion={this.props.Suggestion} />
                </div>
                <div className="col-md-6">
                </div>
            </div>
        )
    }
}

interface LikeState { numberOfLikes?: number, processing?: boolean, userLikesThis?: boolean }
class SuggestionDataViewFooter extends React.Component<ViewSuggestionData, LikeState>
{
    private like: Like;
    constructor() {
        super();
        this.state = { numberOfLikes: 0, processing: false, userLikesThis: false };
    }

    componentWillMount() {
        this.setState({ numberOfLikes: this.props.Suggestion.Likes });
        this.like = new Like(this.props.Suggestion);
        Like.Load(this.props.Suggestion).done((like: Like) => {
            this.like = like;
            this.setState({ userLikesThis: like.UserLikesThis });
        });
    }

    handleLikeClick() {
        if (this.state.processing)
            return;

        this.setState({ processing: true });
        this.like.LikeUnlike().done((numLikes: number) => {
            this.setState({ numberOfLikes: numLikes });
            this.setState({ userLikesThis: this.like.UserLikesThis });
            this.setState({ processing: false });
        }).fail((err: any) => {
            console.log(err);
        });
    }

    renderLikes() {
        if (this.props.Suggestion.Likes <= 0)
            return <div></div>

        var likes = this.props.Suggestion.Likes;
        return <div className="col-xs-4 likes"><span className="glyphicon glyphicon-thumbs-up"></span>{this.state.numberOfLikes}</div>
    }


    renderTags() {
        if (this.props.Suggestion.Tags.length <= 0)
            return (
                <div></div>
            );

        return (
            <div className="col-xs-4 tags">
                <ul>
                    {this.props.Suggestion.Tags.map((value: ITaxonomyTerm, index: number) => {
                        return <li><span className="glyphicon glyphicon-tag"></span>{value.Title}</li>
                    }) }
                </ul>
            </div>)
    }

    renderLikebutton() {
        var btnType = (this.state.userLikesThis) ? "btn-primary disabled" : "btn-success";
        var text = (this.state.userLikesThis) ? "Du liker dette" : "Godt forslag!"
        if (this.state.processing)
            text = "Vent litt...";

        return (
            <div className="likebutton col-xs-4">
                <div className={`btn-xs btn-like ${btnType}`} onClick={this.handleLikeClick.bind(this) }><span className="glyphicon glyphicon-thumbs-up"></span>
                    {text}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="dataviewfooter">
                    {this.renderLikebutton() }
                    {this.renderLikes() }
                    {this.renderTags() }
                </div>
            </div>
        )
    }
}

interface ViewDataField { Text: string, Display: string }
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


interface CommentsState { Comments?: Array<Comment> }
interface CommentsProps { Comments?: Array<Comment> }
class SuggestionComments extends React.Component<ViewSuggestionData, CommentsState>
{
    constructor() {
        super();
        this.state = { Comments: new Array<Comment>() };
    }
    componentWillMount() {
        Comments.AllComments(this.props.Suggestion).done(((result: Array<Comment>) => {
            this.setState({ Comments: result });
        }).bind(this));
    }
    newCommentAddedHandler(newcomment: Comment) {
        console.log(newcomment);
        var comments = this.state.Comments;
        comments.unshift(newcomment);
        this.setState({ Comments: comments });
    }

    render() {
        return (<div className="row">
            <div className="col-xs-12 col-md-6">
                <hr/>
                <NewCommentBox Suggestion={this.props.Suggestion} NewCommentAddedHandler={this.newCommentAddedHandler.bind(this) } />
                <CommentsList Comments={this.state.Comments}  />
            </div></div>)
    }
}
interface NewCommentState { Comment?: Comment, ShowNewComment?: boolean, Sending?: boolean }
class NewCommentBox extends React.Component<ViewSuggestionData, NewCommentState>
{
    constructor() {
        super();
        this.state = { Comment: { Text: "" }, ShowNewComment: false, Sending: false }
    }
    handleTextChanged(e: any) {
        this.state.Comment.Text = e.target.value;
        this.setState({ Comment: this.state.Comment });
    }

    handleShowNewComment(e: any) {
        this.setState({ ShowNewComment: !this.state.ShowNewComment });
    }

    saveNewComment() {
        this.setState({ Sending: true }, (() => {
            Comments.NewComment(this.state.Comment.Text, this.props.Suggestion.Id).done(((comment: Comment) => {
                this.props.NewCommentAddedHandler(comment);
                var c = this.state.Comment;
                c.Text = "";
                this.setState({ Comment: c });
                this.setState({ ShowNewComment: false });
                this.setState({ Sending: false })
            }).bind(this));
        }).bind(this));
    }

    render() {
        if (this.state.Sending)
            return <div className="row"><div className="col-xs-12"><label>Vennligst vent...</label></div></div>;

        if (!this.state.ShowNewComment)
            return (
                <div className="row newcomment">
                    <div className="col-xs-12">
                        <div className="btn-xs btn-like btn-success btn-newcomment" onClick={this.handleShowNewComment.bind(this) }>Ny kommentar</div>
                    </div>
                </div>
            )

        return (
            <div className="newcomment">
                <div className="row">
                    <div className="col-xs-12">
                        <label>Skriv kommentar</label>
                        <textarea value={this.state.Comment.Text} onChange={this.handleTextChanged.bind(this) }></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="btn-xs btn-success btn-send" onClick={this.saveNewComment.bind(this) }>Send</div>
                    </div>
                </div>
            </div>
        );
    }
}




class CommentsList extends React.Component<CommentsProps, {}>
{
    render() {
        console.log(this.props);
        return (
            <div className="row comments">
                <div className="col-xs-12">
                    { this.props.Comments.map(((item: Comment, index: number) => {
                        return <CommentItem comment={item} />
                    }).bind(this)) }

                </div>
            </div>
        );
    }
}

interface CommentState { ImageUrl: string }
interface CommentProps { comment: Comment }

class CommentItem extends React.Component<CommentProps, CommentState>
{
    constructor() {
        super();
        this.state = { ImageUrl: "" };
    }
    componentWillMount() {
        UserProfile.GetProfileImageFor(this.props.comment.Person.LoginName)
            .done(((result: any) => {
                if (result == undefined)
                    return;
                this.setState({ ImageUrl: result });
            }).bind(this));
    }

    RenderProfileImage() {
        if (this.state.ImageUrl != null && this.state.ImageUrl.length > 0)
            return <img src={this.state.ImageUrl} className="profilepicture"/>

        return <span className="glyphicon glyphicon-user profilepicture"></span>
    }

    render() {
        return (<div className="comment">
            <div className="row">
                <div className="col-xs-2">
                    {this.RenderProfileImage() }
                </div>
                <div className="col-xs-10">
                    <h4>{this.props.comment.Person.DisplayName}</h4>
                    <div>{this.props.comment.Text.split("\n").map((item) => {
                        return (<span>{item}<br/></span>);
                    }) }
                    </div>
                    <div className="datefooter">
                        {this.props.comment.Timestamp}
                    </div>
                </div>
            </div>
        </div>);
    }
}