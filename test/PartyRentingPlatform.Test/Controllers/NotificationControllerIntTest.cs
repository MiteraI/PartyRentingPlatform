
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
    public class NotificationsControllerIntTest
    {
        public NotificationsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _notificationRepository = _factory.GetRequiredService<INotificationRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultTitle = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedTitle = "546c776b3e23f5f2ebdd3b0a";

        private const string DefaultDescription = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedDescription = "546c776b3e23f5f2ebdd3b0a";

        private static readonly DateTime DefaultSentTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedSentTime = DateTime.UtcNow;

        private const NotificationType DefaultEnum = NotificationType.REJECTED;
        private const NotificationType UpdatedEnum = NotificationType.REJECTED;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly INotificationRepository _notificationRepository;

        private Notification _notification;

        private readonly IMapper _mapper;

        private Notification CreateEntity()
        {
            return new Notification
            {
                Title = DefaultTitle,
                Description = DefaultDescription,
                SentTime = DefaultSentTime,
                Enum = DefaultEnum,
            };
        }

        private void InitTest()
        {
            _notification = CreateEntity();
        }

        [Fact]
        public async Task CreateNotification()
        {
            var databaseSizeBeforeCreate = await _notificationRepository.CountAsync();

            // Create the Notification
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PostAsync("/api/notifications", TestUtil.ToJsonContent(_notificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testNotification = notificationList.Last();
            testNotification.Title.Should().Be(DefaultTitle);
            testNotification.Description.Should().Be(DefaultDescription);
            testNotification.SentTime.Should().Be(DefaultSentTime);
            testNotification.Enum.Should().Be(DefaultEnum);
        }

        [Fact]
        public async Task CreateNotificationWithExistingId()
        {
            var databaseSizeBeforeCreate = await _notificationRepository.CountAsync();
            // Create the Notification with an existing ID
            _notification.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PostAsync("/api/notifications", TestUtil.ToJsonContent(_notificationDto));

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllNotifications()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();

            // Get all the notificationList
            var response = await _client.GetAsync("/api/notifications?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_notification.Id);
            json.SelectTokens("$.[*].title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].sentTime").Should().Contain(DefaultSentTime);
            json.SelectTokens("$.[*].enum").Should().Contain(DefaultEnum.ToString());
        }

        [Fact]
        public async Task GetNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();

            // Get the notification
            var response = await _client.GetAsync($"/api/notifications/{_notification.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_notification.Id);
            json.SelectTokens("$.title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.sentTime").Should().Contain(DefaultSentTime);
            json.SelectTokens("$.enum").Should().Contain(DefaultEnum.ToString());
        }

        [Fact]
        public async Task GetNonExistingNotification()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/notifications/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _notificationRepository.CountAsync();

            // Update the notification
            var updatedNotification = await _notificationRepository.QueryHelper().GetOneAsync(it => it.Id == _notification.Id);
            // Disconnect from session so that the updates on updatedNotification are not directly saved in db
            //TODO detach
            updatedNotification.Title = UpdatedTitle;
            updatedNotification.Description = UpdatedDescription;
            updatedNotification.SentTime = UpdatedSentTime;
            updatedNotification.Enum = UpdatedEnum;

            NotificationDto updatedNotificationDto = _mapper.Map<NotificationDto>(updatedNotification);
            var response = await _client.PutAsync($"/api/notifications/{_notification.Id}", TestUtil.ToJsonContent(updatedNotificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testNotification = notificationList.Last();
            testNotification.Title.Should().Be(UpdatedTitle);
            testNotification.Description.Should().Be(UpdatedDescription);
            testNotification.SentTime.Should().BeCloseTo(UpdatedSentTime, 1.Milliseconds());
            testNotification.Enum.Should().Be(UpdatedEnum);
        }

        [Fact]
        public async Task UpdateNonExistingNotification()
        {
            var databaseSizeBeforeUpdate = await _notificationRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PutAsync("/api/notifications/1", TestUtil.ToJsonContent(_notificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _notificationRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/notifications/{_notification.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Notification));
            var notification1 = new Notification
            {
                Id = 1L
            };
            var notification2 = new Notification
            {
                Id = notification1.Id
            };
            notification1.Should().Be(notification2);
            notification2.Id = 2L;
            notification1.Should().NotBe(notification2);
            notification1.Id = 0L;
            notification1.Should().NotBe(notification2);
        }
    }
}
