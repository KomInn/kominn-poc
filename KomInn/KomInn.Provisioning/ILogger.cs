using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KomInn.Provisioning
{
    interface ILogger
    {
        void WriteMessage(string message);
    }
}
