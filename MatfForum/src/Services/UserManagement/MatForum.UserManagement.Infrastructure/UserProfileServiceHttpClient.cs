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
    public class UserProfileServiceHttpClient : IUserProfileService
    {
        private readonly HttpClient _httpClient;

        public UserProfileServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<UserProfile?> GetById(Guid id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/{id}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var user = JsonSerializer.Deserialize<UserProfile>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return user;
            }
            catch (HttpRequestException ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error retrieving user by ID: {ex.Message}");
                return null;
            }
        }

        public async Task<IEnumerable<UserProfileDto>> GetAll()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/users");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<IEnumerable<UserProfileDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return users ?? new List<UserProfileDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving all users: {ex.Message}");
                return new List<UserProfileDto>();
            }
        }

        public Task<UserProfile> Create(MatForum.UserManagement.Application.DTOs.CreateUserProfileDto createUserDto)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }

        public Task<UserProfile?> Update(Guid id, MatForum.UserManagement.Application.DTOs.UpdateUserProfileDto updateUserDto)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }

        public Task<bool> Delete(Guid id)
        {
            throw new NotImplementedException("This client only supports retrieving user information.");
        }

        public async Task<int> GetCount()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/users/count");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var count = JsonSerializer.Deserialize<int>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return count;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving user count: {ex.Message}");
                return 0;
            }
        }

        public async Task<IEnumerable<Application.DTOs.TopContributorDto>> GetTopContributors(int count = 10)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/top-contributors?count={count}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var contributors = JsonSerializer.Deserialize<IEnumerable<Application.DTOs.TopContributorDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return contributors ?? new List<Application.DTOs.TopContributorDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving top contributors: {ex.Message}");
                return new List<Application.DTOs.TopContributorDto>();
            }
        }

        public async Task<Application.DTOs.ContributorProfileDto?> GetContributorProfile(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/{userId}/contributor-profile");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var profile = JsonSerializer.Deserialize<Application.DTOs.ContributorProfileDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return profile;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving contributor profile: {ex.Message}");
                return null;
            }
        }
    }
}
