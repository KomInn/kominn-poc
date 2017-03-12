$AppFilesPath = "C:\dev\KomInn\kominn-poc\KomInn\KomInn.Assets\";

$env = @{   
    SiteURL = "https://kominn.sharepoint.com/"; 
    User = "admin@kominn.onmicrosoft.com"; 
Pwd = ConvertTo-SecureString "---" -AsPlainText -Force
}; 



#Install-Module SharePointPnPPowerShellOnline -AllowClobber -WarningAction SilentlyContinue 

$cred = New-Object -typename System.Management.Automation.PSCredential -ArgumentList $env.User, $env.Pwd
Connect-PnPOnline -Url $($env.SiteURL) -Credentials $cred


#cd $AppFilesPath
#webpack
Add-PnPFile -Path $($AppFilesPath + "Provisioning\SiteAssets\js\bundle.js") -Folder "SiteAssets\js\"       
Add-PnPFile -Path $($AppFilesPath + "Provisioning\SiteAssets\js\bundle.js.map") -Folder "SiteAssets\js\"       

#Add-PnPFile -Path $($AppFilesPath + "Provisioning\SiteAssets\lib\jquery\jquery.main.js") -Folder "SiteAssets\js\"       
Add-PnPFile -Path $($AppFilesPath + "Styles\Main.css") -Folder "SiteAssets\css\"       





# return; 
 #Add-PnPFile -Path $($AppFilesPath + "Provisioning\SitePages\Home.aspx") -Folder "SitePages\"       
#Add-PnPFile -Path $($AppFilesPath + "Provisioning\SitePages\NyttForslag.aspx") -Folder "SitePages\"       
#Add-PnPFile -Path $($AppFilesPath + "Provisioning\SitePages\Forslag.aspx") -Folder "SitePages\"       
   