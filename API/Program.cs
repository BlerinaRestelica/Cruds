using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();

            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try{
                    var context = services.GetRequiredService<DataContext>();
                    //Kjo metode e merr databazen qe e japim na nese nuk ka e krijon nja ne baze te migrimit te app.
                    context.Database.Migrate();
                    Seed.SeedData(context);
                }
                //Nese ka ndonje error e gjun Exception qe ka pas error gjate marrjes se db-s
                catch(Exception ex){
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
            //Behet Run applikacioni
            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
