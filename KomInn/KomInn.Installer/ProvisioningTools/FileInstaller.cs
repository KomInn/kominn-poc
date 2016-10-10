using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KomInn
{
    internal class FileInstaller
    {
        private ClientContext siteContext;

        public FileInstaller(string _provisionUrl, ClientContext siteContext)
        {           
            this.siteContext = siteContext;
        }

        internal void CopyAssets()
        {
            var web = siteContext.Web;
            var assets = web.GetListByUrl("Site Assets");
            UploadFiles(assets);
        }
        internal void CopyPages()
        {
            var web = siteContext.Web;
            var pages = web.GetListByUrl("Site Pages");
            UploadFiles(pages);
        }

        public static void UploadFiles(List list)
        {
            var path = $"{Path.GetDirectoryName(Path.GetDirectoryName(Directory.GetCurrentDirectory()))}{"\\apps"}";
            var allfiles = DirSearch(path).ToList();

            allfiles.Sort((a, b) => a.Length - b.Length);
            var folder = list.RootFolder;
            var appsFolder = !list.RootFolder.FolderExists("apps") ? list.RootFolder.CreateFolder("apps") : folder.ResolveSubFolder("apps");
            Console.ForegroundColor = ConsoleColor.Green;
            foreach (var file in allfiles)
            {
                if (file.EndsWith(".ts", StringComparison.InvariantCultureIgnoreCase)
                    || file.EndsWith(".js.map", StringComparison.InvariantCultureIgnoreCase)) // ignore TypeScript.
                    continue;

                var appsFile = file.Replace(path, string.Empty);
                var appFileName = Path.GetFileName(file);
                var subFolderName = appsFile.Replace(appFileName, string.Empty);
                var subFolder = GetSubFolder(appsFolder, subFolderName);
                subFolder.UploadFile(appFileName, file, true);
                Console.WriteLine("\tUploaded {0} to apps{1}", appFileName, subFolderName);

            }
            Console.ResetColor();
        }

        private static Folder GetSubFolder(Folder appsFolder, string subFolderName)
        {
            if (string.IsNullOrEmpty(subFolderName) || subFolderName == "\\")
                return appsFolder;
            if (subFolderName.IndexOf('\\') < 0)
                return appsFolder.ResolveSubFolder(subFolderName);
            if (subFolderName.StartsWith("\\"))
            {
                subFolderName = subFolderName.Substring(1);
            }
            var firstSegment = subFolderName.Split('\\')[0];
            var ix = subFolderName.IndexOf('\\', 1);
            var rest = subFolderName.Substring(ix + 1);
            var subFolder = appsFolder.ResolveSubFolder(firstSegment) ?? appsFolder.CreateFolder(firstSegment);
            return GetSubFolder(subFolder, rest);
        }

        public static string[] DirSearch(string sDir)
        {
            var files = new List<string>();
            var missing = string.Empty;
            try
            {
                foreach (string f in Directory.GetFiles(sDir))
                {
                    missing = f;
                    files.Add(f);
                }
                foreach (string d in Directory.GetDirectories(sDir))
                {
                    missing = d;
                    files.AddRange(DirSearch(d));
                }
            }
            catch (System.Exception excpt)
            {
                Console.Error.WriteLine("Exception caught, current context {0}, error {1}", missing, excpt);
            }

            return files.ToArray();
        }
    }
}
        
    
