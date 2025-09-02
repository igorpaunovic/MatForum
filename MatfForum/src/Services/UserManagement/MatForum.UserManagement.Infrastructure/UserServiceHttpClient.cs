using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using MatForum.UserManagement.Application.DTOs;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace MatForum.UserManagement.Infrastructure
{
    /// <summary>
    /// This service acts as an HTTP client for the UserManagement API.
    /// It implements the IUserService interface to provide a clean separation of concerns.
    /// </summary>
    public class UserServiceHttpClient : IUserService
    {
        private readonly HttpClient _httpClient;

        public UserServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<User?> GetById(Guid id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/{id}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var user = JsonSerializer.Deserialize<User>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return user;
            }
            catch (HttpRequestException ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error retrieving user by ID: {ex.Message}");
                return null;
            }
        }

        public async Task<IEnumerable<UserDto>> GetAll()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/users");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<IEnumerable<UserDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return users ?? new List<UserDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving all users: {ex.Message}");
                return new List<UserDto>();
            }
        }

        public Task<User> Create(MatForum.UserManagement.Application.DTOs.CreateUserDto createUserDto)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }

        public Task<User?> Update(Guid id, MatForum.UserManagement.Application.DTOs.UpdateUserDto updateUserDto)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }

        public Task<bool> Delete(Guid id)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }
    }
}
