using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KomInn.Provisioning
{
    public class ConsoleLogger : ILogger
    {
        public void WriteMessage(string message)
        {
            Console.WriteLine(message);
        }

        public static void WriteError(string message)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(message);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }
}
