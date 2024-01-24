
using AutoMapper;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using PartyRentingPlatform.Infrastructure.Data;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Crosscutting.Enums;
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Configuration.AutoMapper;
using PartyRentingPlatform.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace PartyRentingPlatform.Test.Controllers
{
    public class RoomsControllerIntTest
    {
        public RoomsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _roomRepository = _factory.GetRequiredService<IRoomRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultRoomName = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedRoomName = "546c776b3e23f5f2ebdd3b0a";

        private const string DefaultAddress = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedAddress = "546c776b3e23f5f2ebdd3b0a";

        private const string DefaultDescription = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedDescription = "546c776b3e23f5f2ebdd3b0a";

        private static readonly long DefaultPrice = 1L;
        private static readonly long UpdatedPrice = 2L;

        private static readonly int DefaultRoomCapacity = 1;
        private static readonly int UpdatedRoomCapacity = 2;

        private static readonly int DefaultRating = 1;
        private static readonly int UpdatedRating = 2;

        private const RoomStatus DefaultStatus = RoomStatus.VALID;
        private const RoomStatus UpdatedStatus = RoomStatus.VALID;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IRoomRepository _roomRepository;

        private Room _room;

        private readonly IMapper _mapper;

        private Room CreateEntity()
        {
            return new Room
            {
                RoomName = DefaultRoomName,
                Address = DefaultAddress,
                Description = DefaultDescription,
                Price = DefaultPrice,
                RoomCapacity = DefaultRoomCapacity,
                Rating = DefaultRating,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _room = CreateEntity();
        }

        [Fact]
        public async Task CreateRoom()
        {
            var databaseSizeBeforeCreate = await _roomRepository.CountAsync();

            // Create the Room
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Room in the database
            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testRoom = roomList.Last();
            testRoom.RoomName.Should().Be(DefaultRoomName);
            testRoom.Address.Should().Be(DefaultAddress);
            testRoom.Description.Should().Be(DefaultDescription);
            testRoom.Price.Should().Be(DefaultPrice);
            testRoom.RoomCapacity.Should().Be(DefaultRoomCapacity);
            testRoom.Rating.Should().Be(DefaultRating);
            testRoom.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateRoomWithExistingId()
        {
            var databaseSizeBeforeCreate = await _roomRepository.CountAsync();
            // Create the Room with an existing ID
            _room.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));

            // Validate the Room in the database
            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckRoomNameIsRequired()
        {
            var databaseSizeBeforeTest = await _roomRepository.CountAsync();

            // Set the field to null
            _room.RoomName = null;

            // Create the Room, which fails.
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckAddressIsRequired()
        {
            var databaseSizeBeforeTest = await _roomRepository.CountAsync();

            // Set the field to null
            _room.Address = null;

            // Create the Room, which fails.
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckPriceIsRequired()
        {
            var databaseSizeBeforeTest = await _roomRepository.CountAsync();

            // Set the field to null
            _room.Price = null;

            // Create the Room, which fails.
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckRoomCapacityIsRequired()
        {
            var databaseSizeBeforeTest = await _roomRepository.CountAsync();

            // Set the field to null
            _room.RoomCapacity = null;

            // Create the Room, which fails.
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PostAsync("/api/rooms", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllRooms()
        {
            // Initialize the database
            await _roomRepository.CreateOrUpdateAsync(_room);
            await _roomRepository.SaveChangesAsync();

            // Get all the roomList
            var response = await _client.GetAsync("/api/rooms?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_room.Id);
            json.SelectTokens("$.[*].roomName").Should().Contain(DefaultRoomName);
            json.SelectTokens("$.[*].address").Should().Contain(DefaultAddress);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].price").Should().Contain(DefaultPrice);
            json.SelectTokens("$.[*].roomCapacity").Should().Contain(DefaultRoomCapacity);
            json.SelectTokens("$.[*].rating").Should().Contain(DefaultRating);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetRoom()
        {
            // Initialize the database
            await _roomRepository.CreateOrUpdateAsync(_room);
            await _roomRepository.SaveChangesAsync();

            // Get the room
            var response = await _client.GetAsync($"/api/rooms/{_room.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_room.Id);
            json.SelectTokens("$.roomName").Should().Contain(DefaultRoomName);
            json.SelectTokens("$.address").Should().Contain(DefaultAddress);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.price").Should().Contain(DefaultPrice);
            json.SelectTokens("$.roomCapacity").Should().Contain(DefaultRoomCapacity);
            json.SelectTokens("$.rating").Should().Contain(DefaultRating);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetNonExistingRoom()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/rooms/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateRoom()
        {
            // Initialize the database
            await _roomRepository.CreateOrUpdateAsync(_room);
            await _roomRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _roomRepository.CountAsync();

            // Update the room
            var updatedRoom = await _roomRepository.QueryHelper().GetOneAsync(it => it.Id == _room.Id);
            // Disconnect from session so that the updates on updatedRoom are not directly saved in db
            //TODO detach
            updatedRoom.RoomName = UpdatedRoomName;
            updatedRoom.Address = UpdatedAddress;
            updatedRoom.Description = UpdatedDescription;
            updatedRoom.Price = UpdatedPrice;
            updatedRoom.RoomCapacity = UpdatedRoomCapacity;
            updatedRoom.Rating = UpdatedRating;
            updatedRoom.Status = UpdatedStatus;

            RoomDto updatedRoomDto = _mapper.Map<RoomDto>(updatedRoom);
            var response = await _client.PutAsync($"/api/rooms/{_room.Id}", TestUtil.ToJsonContent(updatedRoomDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Room in the database
            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testRoom = roomList.Last();
            testRoom.RoomName.Should().Be(UpdatedRoomName);
            testRoom.Address.Should().Be(UpdatedAddress);
            testRoom.Description.Should().Be(UpdatedDescription);
            testRoom.Price.Should().Be(UpdatedPrice);
            testRoom.RoomCapacity.Should().Be(UpdatedRoomCapacity);
            testRoom.Rating.Should().Be(UpdatedRating);
            testRoom.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingRoom()
        {
            var databaseSizeBeforeUpdate = await _roomRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            RoomDto _roomDto = _mapper.Map<RoomDto>(_room);
            var response = await _client.PutAsync("/api/rooms/1", TestUtil.ToJsonContent(_roomDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Room in the database
            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteRoom()
        {
            // Initialize the database
            await _roomRepository.CreateOrUpdateAsync(_room);
            await _roomRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _roomRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/rooms/{_room.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var roomList = await _roomRepository.GetAllAsync();
            roomList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Room));
            var room1 = new Room
            {
                Id = 1L
            };
            var room2 = new Room
            {
                Id = room1.Id
            };
            room1.Should().Be(room2);
            room2.Id = 2L;
            room1.Should().NotBe(room2);
            room1.Id = 0L;
            room1.Should().NotBe(room2);
        }
    }
}
