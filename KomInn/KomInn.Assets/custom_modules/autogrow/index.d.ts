 ///<reference path="../jquery/index.d.ts" />

interface AutogrowParams
{
    vertical:boolean;
    horizontal:boolean;
     characterSlop:number
} 

interface JQuery{
    autogrow(options:AutogrowParams):any
}