#define DEBUG
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
2. SharePoint 2013 (On-premises)
");

            string choice = Console.ReadLine();
#if DEBUG
            if(choice == "111")
            {
                var pwd = Input.ReadSecureString();
                var p = new ProvisioningTool("DEV\\Administrator", pwd, "http://smebydev/sites/kominn4",  @"D:\Git\KomInn-poc\KomInn\KomInn.Assets\Provisioning", Platform.Onprem);
                p.InstallSolution();
                Console.WriteLine("Installend");
                Console.ReadKey();
                return; 
            }
            
            if(choice == "112")
            {
                var pwd = Input.ReadSecureString();
                var p = new ProvisioningTool("helges@kominndev.onmicrosoft.com", pwd, "https://kominndev.sharepoint.com/sites/kominn", @"D:\Git\KomInn-poc\KomInn\KomInn.Assets\Provisioning", Platform.Online);
                p.InstallSolution();
                Console.WriteLine("Installend");
                Console.ReadKey();
                return;
            }
            if (choice == "113")
            {
                var pwd = Input.ReadSecureString();
                var p = new ProvisioningTool("helgesmeby@helgesmeby.net", pwd, "https://crayondev.sharepoint.com/sites/kominn2/", @"D:\Git\KomInn-poc\KomInn\KomInn.Assets\Provisioning", Platform.Online);
                p.InstallSolution();
                Console.WriteLine("Installend");
                Console.ReadKey();
                return;
            }
#endif

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
            Console.WriteLine("1. Install solution to " + url);
            Console.WriteLine("2. Export solution to XML"); 
            var operation = Input.GetSpecificInput(new string[] { "1", "2" }); 

            var provtool = new ProvisioningTool(username, password, url, path, platform);
            switch(operation.Trim())
            {
                case "1": provtool.InstallSolution();
                    break;
                case "2":  provtool.ExtractSolution();
                    break;
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

