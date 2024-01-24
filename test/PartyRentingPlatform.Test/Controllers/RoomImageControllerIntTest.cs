
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using PartyRentingPlatform.Infrastructure.Data;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace PartyRentingPlatform.Test.Controllers
{
    public class RoomImagesControllerIntTest
    {
        public RoomImagesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _roomImageRepository = _factory.GetRequiredService<IRoomImageRepository>();


            InitTest();
        }

        private const string DefaultImageUrl = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedImageUrl = "546c776b3e23f5f2ebdd3b0a";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IRoomImageRepository _roomImageRepository;

        private RoomImage _roomImage;


        private RoomImage CreateEntity()
        {
            return new RoomImage
            {
                ImageUrl = DefaultImageUrl,
            };
        }

        private void InitTest()
        {
            _roomImage = CreateEntity();
        }

        [Fact]
        public async Task CreateRoomImage()
        {
            var databaseSizeBeforeCreate = await _roomImageRepository.CountAsync();

            // Create the RoomImage
            var response = await _client.PostAsync("/api/room-images", TestUtil.ToJsonContent(_roomImage));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the RoomImage in the database
            var roomImageList = await _roomImageRepository.GetAllAsync();
            roomImageList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testRoomImage = roomImageList.Last();
            testRoomImage.ImageUrl.Should().Be(DefaultImageUrl);
        }

        [Fact]
        public async Task CreateRoomImageWithExistingId()
        {
            var databaseSizeBeforeCreate = await _roomImageRepository.CountAsync();
            // Create the RoomImage with an existing ID
            _roomImage.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            var response = await _client.PostAsync("/api/room-images", TestUtil.ToJsonContent(_roomImage));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the RoomImage in the database
            var roomImageList = await _roomImageRepository.GetAllAsync();
            roomImageList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllRoomImages()
        {
            // Initialize the database
            await _roomImageRepository.CreateOrUpdateAsync(_roomImage);
            await _roomImageRepository.SaveChangesAsync();

            // Get all the roomImageList
            var response = await _client.GetAsync("/api/room-images?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_roomImage.Id);
            json.SelectTokens("$.[*].imageUrl").Should().Contain(DefaultImageUrl);
        }

        [Fact]
        public async Task GetRoomImage()
        {
            // Initialize the database
            await _roomImageRepository.CreateOrUpdateAsync(_roomImage);
            await _roomImageRepository.SaveChangesAsync();

            // Get the roomImage
            var response = await _client.GetAsync($"/api/room-images/{_roomImage.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_roomImage.Id);
            json.SelectTokens("$.imageUrl").Should().Contain(DefaultImageUrl);
        }

        [Fact]
        public async Task GetNonExistingRoomImage()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/room-images/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateRoomImage()
        {
            // Initialize the database
            await _roomImageRepository.CreateOrUpdateAsync(_roomImage);
            await _roomImageRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _roomImageRepository.CountAsync();

            // Update the roomImage
            var updatedRoomImage = await _roomImageRepository.QueryHelper().GetOneAsync(it => it.Id == _roomImage.Id);
            // Disconnect from session so that the updates on updatedRoomImage are not directly saved in db
            //TODO detach
            updatedRoomImage.ImageUrl = UpdatedImageUrl;

            var response = await _client.PutAsync($"/api/room-images/{_roomImage.Id}", TestUtil.ToJsonContent(updatedRoomImage));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the RoomImage in the database
            var roomImageList = await _roomImageRepository.GetAllAsync();
            roomImageList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testRoomImage = roomImageList.Last();
            testRoomImage.ImageUrl.Should().Be(UpdatedImageUrl);
        }

        [Fact]
        public async Task UpdateNonExistingRoomImage()
        {
            var databaseSizeBeforeUpdate = await _roomImageRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            var response = await _client.PutAsync("/api/room-images/1", TestUtil.ToJsonContent(_roomImage));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the RoomImage in the database
            var roomImageList = await _roomImageRepository.GetAllAsync();
            roomImageList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteRoomImage()
        {
            // Initialize the database
            await _roomImageRepository.CreateOrUpdateAsync(_roomImage);
            await _roomImageRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _roomImageRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/room-images/{_roomImage.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var roomImageList = await _roomImageRepository.GetAllAsync();
            roomImageList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(RoomImage));
            var roomImage1 = new RoomImage
            {
                Id = 1L
            };
            var roomImage2 = new RoomImage
            {
                Id = roomImage1.Id
            };
            roomImage1.Should().Be(roomImage2);
            roomImage2.Id = 2L;
            roomImage1.Should().NotBe(roomImage2);
            roomImage1.Id = 0L;
            roomImage1.Should().NotBe(roomImage2);
        }
    }
}
