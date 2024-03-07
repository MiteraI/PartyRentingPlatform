// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PartyRentingPlatform.Crosscutting.Exceptions;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Dto.Profile;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Controllers
{
    [Authorize]
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ILogger<ProfileController> _log;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IAzureBlobService _azureBlobService;
        private readonly IWalletService _walletService;

        public ProfileController(ILogger<ProfileController> log, IMapper mapper,
            IUserService userService,
            IWalletService walletService,
            IAzureBlobService azureBlobService)
        {
            _log = log;
            _mapper = mapper;
            _userService = userService;
            _walletService = walletService;
            _azureBlobService = azureBlobService;
        }

        [HttpGet]
        public virtual async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var user = await _userService.GetUserWithUserRoles();
            if (user == null) throw new InternalServerErrorException("User could not be found");
            var profileDto = _mapper.Map<ProfileDto>(user);
            return Ok(profileDto);
        }

        [HttpPost("avatar")]
        public virtual async Task<IActionResult> UpdateAvatart([FromForm] IFormFile avatar)
        {
            var userId = User.FindFirst(ClaimTypes.Name).Value;
            var url = await _azureBlobService.UploadAvatar(avatar);
            await _userService.UpdateAvatar(url);
            return Ok("Avatar updated");
        }

        [HttpPut]
        public virtual async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] ProfileDto profileDto)
        {
            profileDto.Id = User.FindFirst(ClaimTypes.Name).Value;

            // Bad Request when there is no username or firstname or lastname
            if (string.IsNullOrEmpty(profileDto.Login) || string.IsNullOrEmpty(profileDto.FirstName) || string.IsNullOrEmpty(profileDto.LastName))
                return BadRequest("Username, Firstname and Lastname are required");

            var user = await _userService.UpdateProfile(_mapper.Map<User>(profileDto));
            var updatedUser = _mapper.Map<ProfileDto>(user);
            updatedUser.Balance = await _walletService.CurrentBalanceForUser(user.Id);
            return updatedUser;
        }

        [HttpPut("become-host")]
        public virtual async Task<IActionResult> UpdateUserToHost()
        {
            var userId = User.FindFirst(ClaimTypes.Name).Value;
            await _userService.UpdateToHost(userId);
            return Ok("Updated to host");
        }
    }
}
