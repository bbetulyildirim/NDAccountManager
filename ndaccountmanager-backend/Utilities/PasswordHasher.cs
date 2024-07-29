using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace NDAccountManager.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hashed;
        }

        public static bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            
            throw new NotImplementedException("VerifyPassword metodu henuz uygulanmamistir.");
        }
    }
}
