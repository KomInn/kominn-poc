using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Framework.Provisioning.Connectors;
using OfficeDevPnP.Core.Framework.Provisioning.Model;
using OfficeDevPnP.Core.Framework.Provisioning.ObjectHandlers;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace KomInn
{
    /// <summary>
    /// Global Platform-enum
    /// </summary>
    public enum Platform { Online = 16, Onprem = 15 };

    public class ProvisioningTemplateTool
    {
        private string WebUrl;
        private string Username;
        private SecureString Password;
        private string Path;
        private Platform Platform;



        /// <summary>
        /// Tool for interacting with provisioning templates in the KomInn-project
        /// </summary>
        /// <param name="_username">Global admin or farm-admin username</param>
        /// <param name="_password">Administrator password</param>
        /// <param name="_weburl">URL to the web</param>
        /// <param name="_path">Path to store / retrieve the template.xml file.</param>
        public ProvisioningTemplateTool(string _username, SecureString _password, string _weburl, string _path, Platform _platform)
        {
            Username = _username;
            Password = _password;
            WebUrl = _weburl;
            Path = _path;
            Platform = _platform; 
        }
       
        public ProvisioningTemplate ProvisioningTemplateFromWeb
        {
            get { return GetProvisioningTemplateFromWeb(); }
        }

        public ProvisioningTemplate ProvisioningTemplateFromFile
        {
            get { return GetProvisioningTemplateFromFile(); }
        }

        public bool ApplyProvisioningTemplate(ProvisioningTemplate template)
        {
            try
            {
                using (var ctx = new ClientContext(WebUrl))
                {
                    ctx.Credentials = ContextBasedCredentials;
                    ctx.RequestTimeout = Timeout.Infinite;

                    Web web = ctx.Web;
                    ctx.Load(web);
                    ctx.ExecuteQueryRetry();

                    ProvisioningTemplateApplyingInformation ptai
                        = new ProvisioningTemplateApplyingInformation();
                    ptai.ProgressDelegate = delegate (String message, Int32 progress, Int32 total)
                    {
                        Console.WriteLine("{0:00}/{1:00} - {2}", progress, total, message);
                    };

                    web.ApplyProvisioningTemplate(template, ptai);
                    return true; 
                }
            }catch(Exception ex)
            {
                ConsoleLogger.WriteError("Could not apply provisioning template.\nException message: " + ex.Message + "\nStackTrace:\n"+ex.StackTrace);
                return false; 
            }
                
        }

        /// <summary>
        /// Save a template to the designated path as XML. Filename: template.xml
        /// </summary>
        /// <param name="template">Template to generate XML from</param>
        public void SaveProvisioningTemplateXML(ProvisioningTemplate template)
        {
            XMLTemplateProvider provider =
                       new XMLFileSystemTemplateProvider(Path, "");
            provider.SaveAs(template, "template.xml");
        }
       
        private ProvisioningTemplate GetProvisioningTemplateFromFile()
        {         
            try
            {
                XMLFileSystemTemplateProvider provider = new XMLFileSystemTemplateProvider(Path, "");
                return provider.GetTemplate("template.xml");
            }
            catch (Exception ex)
            {
                ConsoleLogger.WriteError("Unable to retrieve template.\n" + ex.Message);
                return null; 
            }        
        }

        private ProvisioningTemplate GetProvisioningTemplateFromWeb()
        {
            using (var ctx = new ClientContext(WebUrl))
            {
                ctx.Credentials = ContextBasedCredentials; 
                ctx.RequestTimeout = Timeout.Infinite;
               
                Web web = ctx.Web;
                ctx.Load(web);
                ctx.ExecuteQueryRetry();

                ProvisioningTemplateCreationInformation ptci
                        = new ProvisioningTemplateCreationInformation(ctx.Web);
                ptci.ProgressDelegate = delegate (String message, Int32 progress, Int32 total)
                {                    
                    Console.WriteLine("{0:00}/{1:00} - {2}", progress, total, message);
                };

                ptci.PersistBrandingFiles = true;
                ptci.IncludeAllTermGroups = true;
                ProvisioningTemplate template = ctx.Web.GetProvisioningTemplate(ptci);
                return template;
            }
        }

        private ICredentials ContextBasedCredentials
        {
            get
            {
                ICredentials credentials;
                if (Platform == Platform.Online)
                    credentials = new SharePointOnlineCredentials(Username, Password);
                else
                    credentials = new NetworkCredential(Username, Password);

                return credentials;
            }
        }

    }
}
