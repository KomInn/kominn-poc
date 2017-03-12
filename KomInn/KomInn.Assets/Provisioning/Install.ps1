$InstalledFilesPath = "D:\dev\kominn-poc-master\KomInn\KomInn.Assets\Provisioning"; 
$Tenant = "smebydev";
$User = "helge";
$sitecoll = "/sites/kominn";


Install-Module SharePointPnPPowerShellOnline -AllowClobber -WarningAction SilentlyContinue 
Connect-PnPOnline -Url $("https://"+$Tenant+".sharepoint.com/"+$sitecoll) -Credentials (Get-Credential -Message "Login" -Username $($User+"@"+$Tenant+".onmicrosoft.com"))

Function ApplyTemplate() 
{
Apply-PnPProvisioningTemplate -Path $($InstalledFilesPath + "\template_"+$Tenant+".xml")
}

Function AddPostalCodes()
{

Write-Host "WARNING!" -ForegroundColor Yellow 
Write-Host "This operation can take SEVERAL HOURS to complete. Are you sure you want to run it? [Y/N] (default: N)"
$c = Read-Host 
If($c -ne "Y")
{ return; }


$data = import-csv -Path $($InstalledFilesPath + "\Postnummerregister_ansi.txt") -Delimiter "`t"  -Header "Postnummer", "Sted", "Kommunenummer", "Kommune", "Ex" -Encoding default
foreach ($row in $data) { 
  Add-PnPListItem -List "Kommunenumre" -Values @{"Title" = $row."Sted".ToString(); "Sted"=$row."Sted".ToString(); "Kommunenummer"=$row."Kommunenummer".ToString(); "Postnummer"=$row."Postnummer".ToString(); "Kommune"=$row."Kommune".ToString();  "Ex"="P";}       
}
}


Function CopyFiles()
{
Remove-PnPFile -SiteRelativeUrl "\SitePages\Forslag.aspx" -ErrorAction SilentlyContinue -Confirm:$false  -Force
Remove-PnPFile -SiteRelativeUrl "\SitePages\Home.aspx" -ErrorAction SilentlyContinue -Confirm:$false -Force
Remove-PnPFile -SiteRelativeUrl "\SitePages\NyttForslag.aspx" -ErrorAction SilentlyContinue -Confirm:$false  -Force

Remove-PnPFile -SiteRelativeUrl "\SiteAssets\js\bundle.js" -ErrorAction SilentlyContinue -Confirm:$false -Force
Remove-PnPFile -SiteRelativeUrl "\SiteAssets\js\bundle.js.map" -ErrorAction SilentlyContinue -Confirm:$false -Force
Remove-PnPFile -SiteRelativeUrl "\SiteAssets\css\Style.css" -ErrorAction SilentlyContinue -Confirm:$false -Force

Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\Forslag.aspx") -Folder "SitePages" 
Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\Home.aspx") -Folder "SitePages" 
Add-PnPFile -Path $($InstalledFilesPath + "\SitePages\NyttForslag.aspx") -Folder "SitePages" 

 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\css\bootstrap.min.css") -Folder "SiteAssets\lib\bootstrap\css"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\js\bootstrap.min.js") -Folder "SiteAssets\lib\bootstrap\js"
 
  Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.woff2") -Folder "SiteAssets\lib\bootstrap\fonts"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.woff") -Folder "SiteAssets\lib\bootstrap\fonts"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\bootstrap\fonts\glyphicons-halflings-regular.ttf") -Folder "SiteAssets\lib\bootstrap\fonts"
 
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery\jquery.min.js") -Folder "SiteAssets\lib\jquery"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery.autogrow-textarea\jquery.autogrow-textarea.js") -Folder "SiteAssets\lib\jquery.autogrow-textarea"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\react\react.min.js") -Folder "SiteAssets\lib\react"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\react-dom\react-dom.min.js") -Folder "SiteAssets\lib\react-dom"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\jquery\jquery.min.js") -Folder "SiteAssets\lib\jquery" 
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\lib\typeahead\typeahead.bundle.min.js") -Folder "SiteAssets\lib\typeahead"

   
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\js\bundle.js") -Folder "SiteAssets\js"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\js\bundle.js.map") -Folder "SiteAssets\js"
 Add-PnPFile -Path $($InstalledFilesPath + "\SiteAssets\css\Style.css") -Folder "SiteAssets\css"
 }

 Write-Host "KomInn installer. "; 
Write-Host "[1] Install from template, [2] Add files, [3] Add postal codes (Default 1)";
$Choice = Read-Host;

If($Choice -eq "1" -or $Choice -eq "")
{
 ApplyTemplate; 
}
If($Choice -eq "2")
{
    CopyFiles; 
}
If($Choice -eq "3")
{
 AddPostalCodes;   
}
