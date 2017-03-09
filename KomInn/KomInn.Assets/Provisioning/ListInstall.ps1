
# Forslag
# Kommunenumre
# Likes
# Kommentarer
$AppFilesPath = "C:\dev\KomInn\kominn-poc\KomInn\KomInn.Assets\";

$env = @{   
    SiteURL = "https://smebydev.sharepoint.com/sites/KomInn"; 
    User = "helge@smeby.org"; 
    Pwd = ConvertTo-SecureString "Adg4ng5K0de" -AsPlainText -Force
}; 



#Install-Module SharePointPnPPowerShellOnline -AllowClobber -WarningAction SilentlyContinue 

$cred = New-Object -typename System.Management.Automation.PSCredential -ArgumentList $env.User, $env.Pwd
Connect-PnPOnline -Url $($env.SiteURL) -Credentials $cred

    $title = "Bilder"; 
    
    New-PnPList -Title $title -Template PictureLibrary -Url "Bilder"
    
    $title = "Forslag"; 
    Remove-PnPField -Identity "Status" -List $title;
    New-PnPList -Title $title -Template GenericList -Url "Forslag"   -QuickLaunchOptions Off       
    Add-PnPField -List $title -DisplayName "Oppsummering" -InternalName "Summary" -Type Note -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Utfordringer" -InternalName "Challenges" -Type Note -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Forslag til løsning" -InternalName "SuggestedSolution" -Type Note -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Likes" -InternalName "Likes" -Type Number -Group $group -AddToDefaultView 
    Add-PnPField -List $title -DisplayName "Bilde" -InternalName "Image" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Sted" -InternalName "Location" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Nyttig for andre" -InternalName "UsefulForOthers" -Type Note -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Type nytte" -InternalName "UsefulnessType" -Type Choice -Group $group -AddToDefaultView -Choices "Fag", "Folk", "Penger"
    #Add-PnPField -List $title -DisplayName "Tags" -InternalName "Tags" -Type MultiChoice -Group $group -AddToDefaultView -Choices "Kommunalt", "Skole", "Barnehage"
    Add-PnPField -List $title -DisplayName "AntallKommentarer" -InternalName "NumberOfComments" -Type Number -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Nærmeste leder" -InternalName "Manager" -Type User -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Kommunenummer" -InternalName "CountyCode" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Navn" -InternalName "Name" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Adresse" -InternalName "Address" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Epost adresse" -InternalName "MailAddress" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Telefon" -InternalName "Telephone" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Postnummer" -InternalName "Zipcode" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "By" -InternalName "City" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Avdeling" -InternalName "Department" -Type Text -Group $group -AddToDefaultView
    Add-PnPField -List $title -DisplayName "Status" -InternalName "Status" -Type Choice -Group $group -AddToDefaultView -Choices "Sendt inn", "Publisert", "Kladd", "Suksess", "Promotert" 



    return; 

    $group = "KomInn"; 

$title = "Likes"; 
   
   New-PnPList -Title $title -Template GenericList -Url "Likes"   -QuickLaunchOptions Off          
   Add-PnPField -List $title -DisplayName "Forslag" -InternalName "Forslag" -Type Number -Group $group -AddToDefaultView

   $title = "Kommentarer"; 
   
   New-PnPList -Title $title -Template GenericList -Url "Kommentarer"   -QuickLaunchOptions Off       
      Add-PnPField -List $title -DisplayName "Tekst" -InternalName "Text" -Type Note -Group $group -AddToDefaultView
      Add-PnPField -List $title -DisplayName "Bilde" -InternalName "Image" -Type Text -Group $group -AddToDefaultView
      
      



return; 