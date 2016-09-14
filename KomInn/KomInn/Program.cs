using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace KomInn
{
    public class Program
    {


        public static void Main(string[] args)
        {
            // Platform
            Console.WriteLine(
@"KomInn. 
Select your platform:
1. SharePoint Online
2. SharePoint 2013 (On-premises)");
            string choice = Console.ReadLine();
            var platform = (choice == "1") ? Platform.Online : Platform.Onprem;

            // Site URL
            Console.WriteLine("Type site URL (Site collection must be created manually):");            
            string url = Console.ReadLine();

            // Template.xml path
            Console.WriteLine("Template.xml path:");
            string path = Console.ReadLine();

            // Username
            string username = Input.ReadUsername();

            // Password
            SecureString password = Input.ReadSecureString();

            // Operation                    
            Console.WriteLine("Choose your operation and press Enter:");
            Console.WriteLine("1. Import provisioning template from template.xml");
            Console.WriteLine("2. Export provisioning template to template.xml");
            var operation = Input.GetSpecificInput(new string[] { "1", "2" }); 

            var templatetool = new ProvisioningTemplateTool(username, password, url, path, platform);
            if(operation == "1")
            {
                var template = templatetool.ProvisioningTemplateFromFile;
                templatetool.ApplyProvisioningTemplate(template);                
            }
            else
            {
                var template = templatetool.ProvisioningTemplateFromWeb;
                templatetool.SaveProvisioningTemplateXML(template);               
            }

            Console.WriteLine("Installer ends.");


            /* TODO: Remove dev-settings 
             var url = "http://kominn2.smebydev.dev/";
             var username = "DEV\\Administrator";
             var pwd = Input.ReadSecureString();
             var platform = Installer.Platform.Onprem;
             var path = @"C:\temp\pnpprovisioningdemo";
            
            var url = "https://crayondev.sharepoint.com/sites/kominn/";
            var username = "helgesmeby@helgesmeby.net";
            var pwd = Input.ReadSecureString();
            var platform = Installer.Platform.Online;
            var path = @"C:\temp\pnpprovisioningdemo";
            */


            
        }
    }
}

