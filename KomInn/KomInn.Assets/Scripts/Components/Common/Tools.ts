import { Status }from "./Status";
export class Tools
{
    /**
     * Status to string       
     */
    public static statusToString(status:Status):string
    {
        switch(status)
        {
            case Status.Draft : return "Kladd"; 
            case Status.Promoted : return "Promotert"; 
            case Status.Published : return "Publisert";
            case Status.Submitted : return "Sendt inn"; 
            case Status.Success : return "Suksess"; 

        }
    }

    public static convertStatus(status:string):Status
    {
        switch(status)
        {
            case "Sendt inn" : return Status.Submitted; 
            case "Publisert": return Status.Published; 
            case "Kladd" : return Status.Draft; 
            case "Suksess" : return Status.Success; 
            case "Promotert" : return Status.Promoted; 
        }
    }

    public static IsNull(str:string):boolean
    {
        return str == null || str == undefined; 
    }

    public static FormatDate(date:Date):string
    {
        return this.padZero(date.getDate()) + "." + 
                this.padZero(date.getMonth()+1) + "." +
                date.getFullYear(); 
    }

    private static padZero(num:number):string
    {
        return (num < 10) ? "0" + num.toString() : num.toString();
    }



}