using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace KomInn
{
    public class Input
    {
        public static string GetSpecificInput(string[] values)
        {
            var result = Console.ReadLine();
            if(!values.Contains(result))
            {
                ConsoleLogger.WriteError("Invalid input. Enter a valid value.");
                GetSpecificInput(values); 
            }

            return result; 
        }

        public static string ReadUsername()
        {
            Console.WriteLine("Username should be farm administrator.");
            Console.Write("Username: ");
            var username = Console.ReadLine();
            return username; 
        }

        public static SecureString ReadSecureString()
        {
            Console.Write("Password: ");
            SecureString pwd = new SecureString();
            while (true)
            {
                ConsoleKeyInfo i = Console.ReadKey(true);
                if (i.Key == ConsoleKey.Enter)
                {
                    break;
                }
                else if (i.Key == ConsoleKey.Backspace)
                {
                    if (pwd.Length > 0)
                    {
                        pwd.RemoveAt(pwd.Length - 1);
                        Console.Write("\b \b");
                    }
                }
                else
                {
                    pwd.AppendChar(i.KeyChar);
                    Console.Write("*");
                }
            }
            return pwd;           
        }
    }
}
