using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatForum.UserManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await userService.GetAll();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        var user = await userService.GetById(id);
        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Username = user.Username,
            DateOfBirth = user.DateOfBirth,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return Ok(userDto);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto createUserDto)
    {
        try
        {
            var user = await userService.Create(createUserDto);
            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, userDto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, UpdateUserDto updateUserDto)
    {
        try
        {
            var user = await userService.Update(id, updateUserDto);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(userDto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var deleted = await userService.Delete(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpGet("{id}/exists")]
    public async Task<IActionResult> Exists(Guid id)
    {
        var exists = await userService.GetById(id) != null;
        return exists ? Ok() : NotFound();
    }
}
