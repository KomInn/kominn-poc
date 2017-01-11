$InstalledFilesPath = "D:\dev\test\Provisioning"; 


Install-Module SharePointPnPPowerShellOnline -AllowClobber
Connect-PnPOnline -Url https://kominn.sharepoint.com/ -Credentials (Get-Credential -Message "Login" -Username "admin@kominn.onmicrosoft.com")
#Apply-PnPProvisioningTemplate -Path "D:\dev\kominn-poc-master\KomInn\KomInn.Assets\Provisioning\template.xml" 


$data = import-csv -Path $($InstalledFilesPath + "\Postnummerregister_ansi.txt") -Delimiter "`t"  -Header "Postnummer", "Sted", "Kommunenummer", "Kommune", "Ex" -Encoding default



foreach ($row in $data) { 
  Add-PnPListItem -List "Kommunenumre" -Values @{"Title" = $row."Sted".ToString(); "Sted"=$row."Sted".ToString(); "Kommunenummer"=$row."Kommunenummer".ToString(); "Postnummer"=$row."Postnummer".ToString(); "Kommune"=$row."Kommune".ToString();  "Ex"="P";}       
}

return; 

Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\Forslag.aspx") -Folder "SitePages"
Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\Home.aspx") -Folder "SitePages"
Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\NyttForslag.aspx") -Folder "SitePages"

 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\css\bootstrap.min.css") -Folder "SiteAssets\lib\bootstrap\css"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\js\bootstrap.min.js") -Folder "SiteAssets\lib\bootstrap\js"
 
  Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.woff2") -Folder "SiteAssets\lib\bootstrap\fonts"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.woff") -Folder "SiteAssets\lib\bootstrap\fonts"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.ttf") -Folder "SiteAssets\lib\bootstrap\fonts"
 
 #Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery\jquery.min.js") -Folder "SiteAssets\lib\jquery"
 #Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery.autogrow-textarea\jquery.autogrow-textarea.js") -Folder "SiteAssets\lib\jquery.autogrow-textarea"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\react\react.min.js") -Folder "SiteAssets\lib\react"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\react-dom\react-dom.min.js") -Folder "SiteAssets\lib\react-dom"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery\jquery.min.js") -Folder "SiteAssets\lib\jquery"
 #Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\typeahead\bloodhound.js") -Folder "SiteAssets\lib\typeahead"
 #Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\typeahead\typeahead.jquery.js") -Folder "SiteAssets\lib\typeahead"

 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\js\bundle.js") -Folder "SiteAssets\js"
Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\js\bundle.js.map") -Folder "SiteAssets\js"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\css\Style.css") -Folder "SiteAssets\css"


# Kommenter ut linjen under for å laste inn postnumre og kommunenumre. Dette kan ta flere timer, så vær forsiktig. 
#return; 
