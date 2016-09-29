import * as React from "react";
import * as $ from "jquery";
import { ListData, Suggestion, Suggestions, SuggestionType, SuggestionViewDisplayMode  } from "./SPTools"
import { SuggestionList} from "./AllSuggestions"

interface ViewSuggestionDetailedProps { ShowType?:SuggestionType, Title?:string }
export class ViewSuggestionsDetailed extends React.Component<ViewSuggestionDetailedProps, {}> 
{

    render() { 
        
        return (
            <SuggestionList Type={this.props.ShowType} Title={this.props.Title} DisplayMode={SuggestionViewDisplayMode.Detailed} />
            )
    }
}