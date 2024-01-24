
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
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Configuration.AutoMapper;
using PartyRentingPlatform.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace PartyRentingPlatform.Test.Controllers
{
    public class ServicesControllerIntTest
    {
        public ServicesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _serviceRepository = _factory.GetRequiredService<IServiceRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultServiceName = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedServiceName = "546c776b3e23f5f2ebdd3b0a";

        private static readonly long DefaultPrice = 1L;
        private static readonly long UpdatedPrice = 2L;

        private const string DefaultDescription = "546c776b3e23f5f2ebdd3b03";
        private const string UpdatedDescription = "546c776b3e23f5f2ebdd3b0a";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IServiceRepository _serviceRepository;

        private Service _service;

        private readonly IMapper _mapper;

        private Service CreateEntity()
        {
            return new Service
            {
                ServiceName = DefaultServiceName,
                Price = DefaultPrice,
                Description = DefaultDescription,
            };
        }

        private void InitTest()
        {
            _service = CreateEntity();
        }

        [Fact]
        public async Task CreateService()
        {
            var databaseSizeBeforeCreate = await _serviceRepository.CountAsync();

            // Create the Service
            ServiceDto _serviceDto = _mapper.Map<ServiceDto>(_service);
            var response = await _client.PostAsync("/api/services", TestUtil.ToJsonContent(_serviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Service in the database
            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testService = serviceList.Last();
            testService.ServiceName.Should().Be(DefaultServiceName);
            testService.Price.Should().Be(DefaultPrice);
            testService.Description.Should().Be(DefaultDescription);
        }

        [Fact]
        public async Task CreateServiceWithExistingId()
        {
            var databaseSizeBeforeCreate = await _serviceRepository.CountAsync();
            // Create the Service with an existing ID
            _service.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            ServiceDto _serviceDto = _mapper.Map<ServiceDto>(_service);
            var response = await _client.PostAsync("/api/services", TestUtil.ToJsonContent(_serviceDto));

            // Validate the Service in the database
            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckServiceNameIsRequired()
        {
            var databaseSizeBeforeTest = await _serviceRepository.CountAsync();

            // Set the field to null
            _service.ServiceName = null;

            // Create the Service, which fails.
            ServiceDto _serviceDto = _mapper.Map<ServiceDto>(_service);
            var response = await _client.PostAsync("/api/services", TestUtil.ToJsonContent(_serviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllServices()
        {
            // Initialize the database
            await _serviceRepository.CreateOrUpdateAsync(_service);
            await _serviceRepository.SaveChangesAsync();

            // Get all the serviceList
            var response = await _client.GetAsync("/api/services?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_service.Id);
            json.SelectTokens("$.[*].serviceName").Should().Contain(DefaultServiceName);
            json.SelectTokens("$.[*].price").Should().Contain(DefaultPrice);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
        }

        [Fact]
        public async Task GetService()
        {
            // Initialize the database
            await _serviceRepository.CreateOrUpdateAsync(_service);
            await _serviceRepository.SaveChangesAsync();

            // Get the service
            var response = await _client.GetAsync($"/api/services/{_service.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_service.Id);
            json.SelectTokens("$.serviceName").Should().Contain(DefaultServiceName);
            json.SelectTokens("$.price").Should().Contain(DefaultPrice);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
        }

        [Fact]
        public async Task GetNonExistingService()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/services/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateService()
        {
            // Initialize the database
            await _serviceRepository.CreateOrUpdateAsync(_service);
            await _serviceRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _serviceRepository.CountAsync();

            // Update the service
            var updatedService = await _serviceRepository.QueryHelper().GetOneAsync(it => it.Id == _service.Id);
            // Disconnect from session so that the updates on updatedService are not directly saved in db
            //TODO detach
            updatedService.ServiceName = UpdatedServiceName;
            updatedService.Price = UpdatedPrice;
            updatedService.Description = UpdatedDescription;

            ServiceDto updatedServiceDto = _mapper.Map<ServiceDto>(updatedService);
            var response = await _client.PutAsync($"/api/services/{_service.Id}", TestUtil.ToJsonContent(updatedServiceDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Service in the database
            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testService = serviceList.Last();
            testService.ServiceName.Should().Be(UpdatedServiceName);
            testService.Price.Should().Be(UpdatedPrice);
            testService.Description.Should().Be(UpdatedDescription);
        }

        [Fact]
        public async Task UpdateNonExistingService()
        {
            var databaseSizeBeforeUpdate = await _serviceRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            ServiceDto _serviceDto = _mapper.Map<ServiceDto>(_service);
            var response = await _client.PutAsync("/api/services/1", TestUtil.ToJsonContent(_serviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Service in the database
            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteService()
        {
            // Initialize the database
            await _serviceRepository.CreateOrUpdateAsync(_service);
            await _serviceRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _serviceRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/services/{_service.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var serviceList = await _serviceRepository.GetAllAsync();
            serviceList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Service));
            var service1 = new Service
            {
                Id = 1L
            };
            var service2 = new Service
            {
                Id = service1.Id
            };
            service1.Should().Be(service2);
            service2.Id = 2L;
            service1.Should().NotBe(service2);
            service1.Id = 0L;
            service1.Should().NotBe(service2);
        }
    }
}
