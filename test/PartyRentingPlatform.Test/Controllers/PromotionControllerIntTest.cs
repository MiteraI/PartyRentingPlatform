
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
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Configuration.AutoMapper;
using PartyRentingPlatform.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace PartyRentingPlatform.Test.Controllers
{
    public class PromotionsControllerIntTest
    {
        public PromotionsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _promotionRepository = _factory.GetRequiredService<IPromotionRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private static readonly DateTime DefaultStartTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedStartTime = DateTime.UtcNow;

        private static readonly DateTime DefaultEndTime = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedEndTime = DateTime.UtcNow;

        private static readonly int DefaultDiscount = 1;
        private static readonly int UpdatedDiscount = 2;

        private static readonly long DefaultMinimum = 1L;
        private static readonly long UpdatedMinimum = 2L;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IPromotionRepository _promotionRepository;

        private Promotion _promotion;

        private readonly IMapper _mapper;

        private Promotion CreateEntity()
        {
            return new Promotion
            {
                StartTime = DefaultStartTime,
                EndTime = DefaultEndTime,
                Discount = DefaultDiscount,
                Minimum = DefaultMinimum,
            };
        }

        private void InitTest()
        {
            _promotion = CreateEntity();
        }

        [Fact]
        public async Task CreatePromotion()
        {
            var databaseSizeBeforeCreate = await _promotionRepository.CountAsync();

            // Create the Promotion
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PostAsync("/api/promotions", TestUtil.ToJsonContent(_promotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Promotion in the database
            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testPromotion = promotionList.Last();
            testPromotion.StartTime.Should().Be(DefaultStartTime);
            testPromotion.EndTime.Should().Be(DefaultEndTime);
            testPromotion.Discount.Should().Be(DefaultDiscount);
            testPromotion.Minimum.Should().Be(DefaultMinimum);
        }

        [Fact]
        public async Task CreatePromotionWithExistingId()
        {
            var databaseSizeBeforeCreate = await _promotionRepository.CountAsync();
            // Create the Promotion with an existing ID
            _promotion.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PostAsync("/api/promotions", TestUtil.ToJsonContent(_promotionDto));

            // Validate the Promotion in the database
            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckStartTimeIsRequired()
        {
            var databaseSizeBeforeTest = await _promotionRepository.CountAsync();

            // Set the field to null
            _promotion.StartTime = DateTime.UtcNow;

            // Create the Promotion, which fails.
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PostAsync("/api/promotions", TestUtil.ToJsonContent(_promotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckEndTimeIsRequired()
        {
            var databaseSizeBeforeTest = await _promotionRepository.CountAsync();

            // Set the field to null
            _promotion.EndTime = DateTime.UtcNow;

            // Create the Promotion, which fails.
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PostAsync("/api/promotions", TestUtil.ToJsonContent(_promotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckDiscountIsRequired()
        {
            var databaseSizeBeforeTest = await _promotionRepository.CountAsync();

            // Set the field to null
            _promotion.Discount = null;

            // Create the Promotion, which fails.
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PostAsync("/api/promotions", TestUtil.ToJsonContent(_promotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllPromotions()
        {
            // Initialize the database
            await _promotionRepository.CreateOrUpdateAsync(_promotion);
            await _promotionRepository.SaveChangesAsync();

            // Get all the promotionList
            var response = await _client.GetAsync("/api/promotions?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_promotion.Id);
            json.SelectTokens("$.[*].startTime").Should().Contain(DefaultStartTime);
            json.SelectTokens("$.[*].endTime").Should().Contain(DefaultEndTime);
            json.SelectTokens("$.[*].discount").Should().Contain(DefaultDiscount);
            json.SelectTokens("$.[*].minimum").Should().Contain(DefaultMinimum);
        }

        [Fact]
        public async Task GetPromotion()
        {
            // Initialize the database
            await _promotionRepository.CreateOrUpdateAsync(_promotion);
            await _promotionRepository.SaveChangesAsync();

            // Get the promotion
            var response = await _client.GetAsync($"/api/promotions/{_promotion.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_promotion.Id);
            json.SelectTokens("$.startTime").Should().Contain(DefaultStartTime);
            json.SelectTokens("$.endTime").Should().Contain(DefaultEndTime);
            json.SelectTokens("$.discount").Should().Contain(DefaultDiscount);
            json.SelectTokens("$.minimum").Should().Contain(DefaultMinimum);
        }

        [Fact]
        public async Task GetNonExistingPromotion()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/promotions/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdatePromotion()
        {
            // Initialize the database
            await _promotionRepository.CreateOrUpdateAsync(_promotion);
            await _promotionRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _promotionRepository.CountAsync();

            // Update the promotion
            var updatedPromotion = await _promotionRepository.QueryHelper().GetOneAsync(it => it.Id == _promotion.Id);
            // Disconnect from session so that the updates on updatedPromotion are not directly saved in db
            //TODO detach
            updatedPromotion.StartTime = UpdatedStartTime;
            updatedPromotion.EndTime = UpdatedEndTime;
            updatedPromotion.Discount = UpdatedDiscount;
            updatedPromotion.Minimum = UpdatedMinimum;

            PromotionDto updatedPromotionDto = _mapper.Map<PromotionDto>(updatedPromotion);
            var response = await _client.PutAsync($"/api/promotions/{_promotion.Id}", TestUtil.ToJsonContent(updatedPromotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Promotion in the database
            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testPromotion = promotionList.Last();
            testPromotion.StartTime.Should().BeCloseTo(UpdatedStartTime, 1.Milliseconds());
            testPromotion.EndTime.Should().BeCloseTo(UpdatedEndTime, 1.Milliseconds());
            testPromotion.Discount.Should().Be(UpdatedDiscount);
            testPromotion.Minimum.Should().Be(UpdatedMinimum);
        }

        [Fact]
        public async Task UpdateNonExistingPromotion()
        {
            var databaseSizeBeforeUpdate = await _promotionRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            PromotionDto _promotionDto = _mapper.Map<PromotionDto>(_promotion);
            var response = await _client.PutAsync("/api/promotions/1", TestUtil.ToJsonContent(_promotionDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Promotion in the database
            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeletePromotion()
        {
            // Initialize the database
            await _promotionRepository.CreateOrUpdateAsync(_promotion);
            await _promotionRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _promotionRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/promotions/{_promotion.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var promotionList = await _promotionRepository.GetAllAsync();
            promotionList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Promotion));
            var promotion1 = new Promotion
            {
                Id = 1L
            };
            var promotion2 = new Promotion
            {
                Id = promotion1.Id
            };
            promotion1.Should().Be(promotion2);
            promotion2.Id = 2L;
            promotion1.Should().NotBe(promotion2);
            promotion1.Id = 0L;
            promotion1.Should().NotBe(promotion2);
        }
    }
}
