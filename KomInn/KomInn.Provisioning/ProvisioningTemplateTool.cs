using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace KomInn.Provisioning
{
    public class ProvisioningTemplateTool
    {
        private string WebUrl;
        private string Username;
        private SecureString Password;
        private string Path; 

        public ProvisioningTemplateTool(string _username, SecureString _password, string _weburl, string _path)
        {
            Username = _username;
            Password = _password;
            WebUrl = _weburl;
            Path = _path; 
        }

        public 

        /// <summary>
        /// Retrieves and stores a provisioning template to the file system. 
        /// Filename: template.xml
        /// </summary>        
        /// <param name="webUrl">Url to the site collection</param>
        /// <param name="userName">Username to access the site</param>
        /// <param name="pwd">Password to access the site</param>
        /// <param name="path">Storage location for the template.xml</param>
        /// <returns></returns>
        public static ProvisioningTemplate GetProvisioningTemplate(string webUrl, string userName, SecureString pwd, string path)
        {
            using (var ctx = new ClientContext(webUrl))
            {
                ctx.Credentials = new NetworkCredential(userName, pwd);
                //  ctx.Credentials = new SharePointOnlineCredentials(userName, pwd);
                ctx.RequestTimeout = Timeout.Infinite;

                // Just to output the site details
                Web web = ctx.Web;
                ctx.Load(web);
                ctx.ExecuteQueryRetry();

                ProvisioningTemplateCreationInformation ptci
                        = new ProvisioningTemplateCreationInformation(ctx.Web);

                // TODO: Change XML paths
                ptci.FileConnector = new FileSystemConnector(path, "");
                ptci.PersistBrandingFiles = true;
                ptci.ProgressDelegate = delegate (String message, Int32 progress, Int32 total)
                {
                    // Only to output progress for console UI
                    Console.WriteLine("{0:00}/{1:00} - {2}", progress, total, message);
                };

                ptci.IncludeAllTermGroups = true;
                ProvisioningTemplate template = ctx.Web.GetProvisioningTemplate(ptci);

                XMLTemplateProvider provider =
                        new XMLFileSystemTemplateProvider(path, "");
                provider.SaveAs(template, "template.xml");

                return template;
            }
        }
    }
}
