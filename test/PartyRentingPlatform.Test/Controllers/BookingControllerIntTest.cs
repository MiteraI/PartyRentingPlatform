
using AutoMapper;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using FluentAssertions.Extensions;
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
    public class BookingsControllerIntTest
    {
        public BookingsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _bookingRepository = _factory.GetRequiredService<IBookingRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultCustomerName = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedCustomerName = "546c776b3e23f5f2ebdd3b0a";

        private static readonly DateTime DefaultBookTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedBookTime = DateTime.UtcNow;

        private static readonly DateTime DefaultStartTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedStartTime = DateTime.UtcNow;

        private static readonly DateTime DefaultEndTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedEndTime = DateTime.UtcNow;

        private static readonly long DefaultTotalPrice = 1L;
        private static readonly long UpdatedTotalPrice = 2L;

        private const BookingStatus DefaultStatus = BookingStatus.APPROVING;
        private const BookingStatus UpdatedStatus = BookingStatus.APPROVING;

        private static readonly int DefaultRating = 1;
        private static readonly int UpdatedRating = 2;

        private const string DefaultComment = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedComment = "546c776b3e23f5f2ebdd3b0a";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IBookingRepository _bookingRepository;

        private Booking _booking;

        private readonly IMapper _mapper;

        private Booking CreateEntity()
        {
            return new Booking
            {
                CustomerName = DefaultCustomerName,
                BookTime = DefaultBookTime,
                StartTime = DefaultStartTime,
                EndTime = DefaultEndTime,
                TotalPrice = DefaultTotalPrice,
                Status = DefaultStatus,
                Rating = DefaultRating,
                Comment = DefaultComment,
            };
        }

        private void InitTest()
        {
            _booking = CreateEntity();
        }

        [Fact]
        public async Task CreateBooking()
        {
            var databaseSizeBeforeCreate = await _bookingRepository.CountAsync();

            // Create the Booking
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Booking in the database
            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testBooking = bookingList.Last();
            testBooking.CustomerName.Should().Be(DefaultCustomerName);
            testBooking.BookTime.Should().Be(DefaultBookTime);
            testBooking.StartTime.Should().Be(DefaultStartTime);
            testBooking.EndTime.Should().Be(DefaultEndTime);
            testBooking.TotalPrice.Should().Be(DefaultTotalPrice);
            testBooking.Status.Should().Be(DefaultStatus);
            testBooking.Rating.Should().Be(DefaultRating);
            testBooking.Comment.Should().Be(DefaultComment);
        }

        [Fact]
        public async Task CreateBookingWithExistingId()
        {
            var databaseSizeBeforeCreate = await _bookingRepository.CountAsync();
            // Create the Booking with an existing ID
            _booking.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));

            // Validate the Booking in the database
            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckBookTimeIsRequired()
        {
            var databaseSizeBeforeTest = await _bookingRepository.CountAsync();

            // Set the field to null
            _booking.BookTime = DateTime.UtcNow;

            // Create the Booking, which fails.
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckStartTimeIsRequired()
        {
            var databaseSizeBeforeTest = await _bookingRepository.CountAsync();

            // Set the field to null
            _booking.StartTime = DateTime.UtcNow;

            // Create the Booking, which fails.
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckEndTimeIsRequired()
        {
            var databaseSizeBeforeTest = await _bookingRepository.CountAsync();

            // Set the field to null
            _booking.EndTime = DateTime.UtcNow;

            // Create the Booking, which fails.
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckTotalPriceIsRequired()
        {
            var databaseSizeBeforeTest = await _bookingRepository.CountAsync();

            // Set the field to null
            _booking.TotalPrice = null;

            // Create the Booking, which fails.
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PostAsync("/api/bookings", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllBookings()
        {
            // Initialize the database
            await _bookingRepository.CreateOrUpdateAsync(_booking);
            await _bookingRepository.SaveChangesAsync();

            // Get all the bookingList
            var response = await _client.GetAsync("/api/bookings?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_booking.Id);
            json.SelectTokens("$.[*].customerName").Should().Contain(DefaultCustomerName);
            json.SelectTokens("$.[*].bookTime").Should().Contain(DefaultBookTime);
            json.SelectTokens("$.[*].startTime").Should().Contain(DefaultStartTime);
            json.SelectTokens("$.[*].endTime").Should().Contain(DefaultEndTime);
            json.SelectTokens("$.[*].totalPrice").Should().Contain(DefaultTotalPrice);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
            json.SelectTokens("$.[*].rating").Should().Contain(DefaultRating);
            json.SelectTokens("$.[*].comment").Should().Contain(DefaultComment);
        }

        [Fact]
        public async Task GetBooking()
        {
            // Initialize the database
            await _bookingRepository.CreateOrUpdateAsync(_booking);
            await _bookingRepository.SaveChangesAsync();

            // Get the booking
            var response = await _client.GetAsync($"/api/bookings/{_booking.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_booking.Id);
            json.SelectTokens("$.customerName").Should().Contain(DefaultCustomerName);
            json.SelectTokens("$.bookTime").Should().Contain(DefaultBookTime);
            json.SelectTokens("$.startTime").Should().Contain(DefaultStartTime);
            json.SelectTokens("$.endTime").Should().Contain(DefaultEndTime);
            json.SelectTokens("$.totalPrice").Should().Contain(DefaultTotalPrice);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
            json.SelectTokens("$.rating").Should().Contain(DefaultRating);
            json.SelectTokens("$.comment").Should().Contain(DefaultComment);
        }

        [Fact]
        public async Task GetNonExistingBooking()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/bookings/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateBooking()
        {
            // Initialize the database
            await _bookingRepository.CreateOrUpdateAsync(_booking);
            await _bookingRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _bookingRepository.CountAsync();

            // Update the booking
            var updatedBooking = await _bookingRepository.QueryHelper().GetOneAsync(it => it.Id == _booking.Id);
            // Disconnect from session so that the updates on updatedBooking are not directly saved in db
            //TODO detach
            updatedBooking.CustomerName = UpdatedCustomerName;
            updatedBooking.BookTime = UpdatedBookTime;
            updatedBooking.StartTime = UpdatedStartTime;
            updatedBooking.EndTime = UpdatedEndTime;
            updatedBooking.TotalPrice = UpdatedTotalPrice;
            updatedBooking.Status = UpdatedStatus;
            updatedBooking.Rating = UpdatedRating;
            updatedBooking.Comment = UpdatedComment;

            BookingDto updatedBookingDto = _mapper.Map<BookingDto>(updatedBooking);
            var response = await _client.PutAsync($"/api/bookings/{_booking.Id}", TestUtil.ToJsonContent(updatedBookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Booking in the database
            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testBooking = bookingList.Last();
            testBooking.CustomerName.Should().Be(UpdatedCustomerName);
            testBooking.BookTime.Should().BeCloseTo(UpdatedBookTime, 1.Milliseconds());
            testBooking.StartTime.Should().BeCloseTo(UpdatedStartTime, 1.Milliseconds());
            testBooking.EndTime.Should().BeCloseTo(UpdatedEndTime, 1.Milliseconds());
            testBooking.TotalPrice.Should().Be(UpdatedTotalPrice);
            testBooking.Status.Should().Be(UpdatedStatus);
            testBooking.Rating.Should().Be(UpdatedRating);
            testBooking.Comment.Should().Be(UpdatedComment);
        }

        [Fact]
        public async Task UpdateNonExistingBooking()
        {
            var databaseSizeBeforeUpdate = await _bookingRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            BookingDto _bookingDto = _mapper.Map<BookingDto>(_booking);
            var response = await _client.PutAsync("/api/bookings/1", TestUtil.ToJsonContent(_bookingDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Booking in the database
            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteBooking()
        {
            // Initialize the database
            await _bookingRepository.CreateOrUpdateAsync(_booking);
            await _bookingRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _bookingRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/bookings/{_booking.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var bookingList = await _bookingRepository.GetAllAsync();
            bookingList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Booking));
            var booking1 = new Booking
            {
                Id = 1L
            };
            var booking2 = new Booking
            {
                Id = booking1.Id
            };
            booking1.Should().Be(booking2);
            booking2.Id = 2L;
            booking1.Should().NotBe(booking2);
            booking1.Id = 0L;
            booking1.Should().NotBe(booking2);
        }
    }
}
