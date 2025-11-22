using Electrolysis360.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Electrolysis360.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Experiment> Experiments { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

    }
}
