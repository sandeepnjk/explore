using System.Linq;
using System.Reflection;
using System;

namespace HelloCS
{
    class Program
    {
        static void Main(string[] args)
        {
            //int z;
            //Console.WriteLine("Hello C#!");
            //loop thru assemblies that this app references

            System.Data.DataSet ds;
            System.Net.Http.HttpClient client;

            //load the assembly to get the details
            foreach (var r in Assembly.GetEntryAssembly().GetReferencedAssemblies()) {
                var a = Assembly.Load(new AssemblyName(r.FullName));
                int methodCount = 0;
                //all types in the assembly
                foreach (var item in a.DefinedTypes) {
                    //count methods
                    methodCount += item.GetMethods().Count();
                }
                Console.WriteLine("{0} types with {1} methods in {2} assembly.",
                    arg0: a.DefinedTypes.Count(), 
                    arg1: methodCount, 
                    arg2: r.Name);
            }
        }
    }
}
