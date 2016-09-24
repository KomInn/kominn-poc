
    $.ajaxSetup({headers: {"Accept": "application/json;odata=verbose"}})
    export class UserProfile 
    {
        ensureUser(username:string):JQueryPromise<any>      
        {            
            var payload = { 'logonName': username }; 
            return $.ajax({
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            data: JSON.stringify(payload),
                            headers: {
                                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                "accept": "application/json;odata=verbose"
                            }}).then((data:any) => { return data; })
                            .fail((err:any) => { return err });
        }

    }

    export class Taxonomy
    {
       
    }

    export class ListData
    {
        public getDataFromList(listName:string, odata:string):JQueryPromise<any>
        {
            return $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+listName+"')/Items"+odata)
                .then((data:any) => { return data });
        }
    }

    export class AppFunctions
    {
        public likeStatus(itemId:number):JQueryPromise<any>
        {
            return new ListData().getDataFromList("Likerklikk", "?$select=*,Forslag/Id,Person/Id&$expand=Forslag,Person&$filter=Forslag/Id eq " + itemId + " and Person/Id eq " + _spPageContextInfo.userId ).then((d:any) => {                
                return d;  
            });


        }
    }
