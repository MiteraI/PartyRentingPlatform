
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
    public class BookingDetailsControllerIntTest
    {
        public BookingDetailsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _bookingDetailsRepository = _factory.GetRequiredService<IBookingDetailsRepository>();


            InitTest();
        }

        private static readonly int DefaultServiceQuantity = 1;
        private static readonly int UpdatedServiceQuantity = 2;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IBookingDetailsRepository _bookingDetailsRepository;

        private BookingDetails _bookingDetails;


        private BookingDetails CreateEntity()
        {
            return new BookingDetails
            {
                ServiceQuantity = DefaultServiceQuantity,
            };
        }

        private void InitTest()
        {
            _bookingDetails = CreateEntity();
        }

        [Fact]
        public async Task CreateBookingDetails()
        {
            var databaseSizeBeforeCreate = await _bookingDetailsRepository.CountAsync();

            // Create the BookingDetails
            var response = await _client.PostAsync("/api/booking-details", TestUtil.ToJsonContent(_bookingDetails));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the BookingDetails in the database
            var bookingDetailsList = await _bookingDetailsRepository.GetAllAsync();
            bookingDetailsList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testBookingDetails = bookingDetailsList.Last();
            testBookingDetails.ServiceQuantity.Should().Be(DefaultServiceQuantity);
        }

        [Fact]
        public async Task CreateBookingDetailsWithExistingId()
        {
            var databaseSizeBeforeCreate = await _bookingDetailsRepository.CountAsync();
            // Create the BookingDetails with an existing ID
            _bookingDetails.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            var response = await _client.PostAsync("/api/booking-details", TestUtil.ToJsonContent(_bookingDetails));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the BookingDetails in the database
            var bookingDetailsList = await _bookingDetailsRepository.GetAllAsync();
            bookingDetailsList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllBookingDetails()
        {
            // Initialize the database
            await _bookingDetailsRepository.CreateOrUpdateAsync(_bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();

            // Get all the bookingDetailsList
            var response = await _client.GetAsync("/api/booking-details?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_bookingDetails.Id);
            json.SelectTokens("$.[*].serviceQuantity").Should().Contain(DefaultServiceQuantity);
        }

        [Fact]
        public async Task GetBookingDetails()
        {
            // Initialize the database
            await _bookingDetailsRepository.CreateOrUpdateAsync(_bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();

            // Get the bookingDetails
            var response = await _client.GetAsync($"/api/booking-details/{_bookingDetails.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_bookingDetails.Id);
            json.SelectTokens("$.serviceQuantity").Should().Contain(DefaultServiceQuantity);
        }

        [Fact]
        public async Task GetNonExistingBookingDetails()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/booking-details/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateBookingDetails()
        {
            // Initialize the database
            await _bookingDetailsRepository.CreateOrUpdateAsync(_bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _bookingDetailsRepository.CountAsync();

            // Update the bookingDetails
            var updatedBookingDetails = await _bookingDetailsRepository.QueryHelper().GetOneAsync(it => it.Id == _bookingDetails.Id);
            // Disconnect from session so that the updates on updatedBookingDetails are not directly saved in db
            //TODO detach
            updatedBookingDetails.ServiceQuantity = UpdatedServiceQuantity;

            var response = await _client.PutAsync($"/api/booking-details/{_bookingDetails.Id}", TestUtil.ToJsonContent(updatedBookingDetails));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the BookingDetails in the database
            var bookingDetailsList = await _bookingDetailsRepository.GetAllAsync();
            bookingDetailsList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testBookingDetails = bookingDetailsList.Last();
            testBookingDetails.ServiceQuantity.Should().Be(UpdatedServiceQuantity);
        }

        [Fact]
        public async Task UpdateNonExistingBookingDetails()
        {
            var databaseSizeBeforeUpdate = await _bookingDetailsRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            var response = await _client.PutAsync("/api/booking-details/1", TestUtil.ToJsonContent(_bookingDetails));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the BookingDetails in the database
            var bookingDetailsList = await _bookingDetailsRepository.GetAllAsync();
            bookingDetailsList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteBookingDetails()
        {
            // Initialize the database
            await _bookingDetailsRepository.CreateOrUpdateAsync(_bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _bookingDetailsRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/booking-details/{_bookingDetails.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var bookingDetailsList = await _bookingDetailsRepository.GetAllAsync();
            bookingDetailsList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(BookingDetails));
            var bookingDetails1 = new BookingDetails
            {
                Id = 1L
            };
            var bookingDetails2 = new BookingDetails
            {
                Id = bookingDetails1.Id
            };
            bookingDetails1.Should().Be(bookingDetails2);
            bookingDetails2.Id = 2L;
            bookingDetails1.Should().NotBe(bookingDetails2);
            bookingDetails1.Id = 0L;
            bookingDetails1.Should().NotBe(bookingDetails2);
        }
    }
}
