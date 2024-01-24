
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
    public class ReportsControllerIntTest
    {
        public ReportsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _reportRepository = _factory.GetRequiredService<IReportRepository>();

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

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IReportRepository _reportRepository;

        private Report _report;

        private readonly IMapper _mapper;

        private Report CreateEntity()
        {
            return new Report
            {
                Title = DefaultTitle,
                Description = DefaultDescription,
                SentTime = DefaultSentTime,
            };
        }

        private void InitTest()
        {
            _report = CreateEntity();
        }

        [Fact]
        public async Task CreateReport()
        {
            var databaseSizeBeforeCreate = await _reportRepository.CountAsync();

            // Create the Report
            ReportDto _reportDto = _mapper.Map<ReportDto>(_report);
            var response = await _client.PostAsync("/api/reports", TestUtil.ToJsonContent(_reportDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Report in the database
            var reportList = await _reportRepository.GetAllAsync();
            reportList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testReport = reportList.Last();
            testReport.Title.Should().Be(DefaultTitle);
            testReport.Description.Should().Be(DefaultDescription);
            testReport.SentTime.Should().Be(DefaultSentTime);
        }

        [Fact]
        public async Task CreateReportWithExistingId()
        {
            var databaseSizeBeforeCreate = await _reportRepository.CountAsync();
            // Create the Report with an existing ID
            _report.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            ReportDto _reportDto = _mapper.Map<ReportDto>(_report);
            var response = await _client.PostAsync("/api/reports", TestUtil.ToJsonContent(_reportDto));

            // Validate the Report in the database
            var reportList = await _reportRepository.GetAllAsync();
            reportList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllReports()
        {
            // Initialize the database
            await _reportRepository.CreateOrUpdateAsync(_report);
            await _reportRepository.SaveChangesAsync();

            // Get all the reportList
            var response = await _client.GetAsync("/api/reports?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_report.Id);
            json.SelectTokens("$.[*].title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].sentTime").Should().Contain(DefaultSentTime);
        }

        [Fact]
        public async Task GetReport()
        {
            // Initialize the database
            await _reportRepository.CreateOrUpdateAsync(_report);
            await _reportRepository.SaveChangesAsync();

            // Get the report
            var response = await _client.GetAsync($"/api/reports/{_report.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_report.Id);
            json.SelectTokens("$.title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.sentTime").Should().Contain(DefaultSentTime);
        }

        [Fact]
        public async Task GetNonExistingReport()
        {
            var maxValue = 9999999L;
            var response = await _client.GetAsync("/api/reports/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateReport()
        {
            // Initialize the database
            await _reportRepository.CreateOrUpdateAsync(_report);
            await _reportRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _reportRepository.CountAsync();

            // Update the report
            var updatedReport = await _reportRepository.QueryHelper().GetOneAsync(it => it.Id == _report.Id);
            // Disconnect from session so that the updates on updatedReport are not directly saved in db
            //TODO detach
            updatedReport.Title = UpdatedTitle;
            updatedReport.Description = UpdatedDescription;
            updatedReport.SentTime = UpdatedSentTime;

            ReportDto updatedReportDto = _mapper.Map<ReportDto>(updatedReport);
            var response = await _client.PutAsync($"/api/reports/{_report.Id}", TestUtil.ToJsonContent(updatedReportDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Report in the database
            var reportList = await _reportRepository.GetAllAsync();
            reportList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testReport = reportList.Last();
            testReport.Title.Should().Be(UpdatedTitle);
            testReport.Description.Should().Be(UpdatedDescription);
            testReport.SentTime.Should().BeCloseTo(UpdatedSentTime, 1.Milliseconds());
        }

        [Fact]
        public async Task UpdateNonExistingReport()
        {
            var databaseSizeBeforeUpdate = await _reportRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            ReportDto _reportDto = _mapper.Map<ReportDto>(_report);
            var response = await _client.PutAsync("/api/reports/1", TestUtil.ToJsonContent(_reportDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Report in the database
            var reportList = await _reportRepository.GetAllAsync();
            reportList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteReport()
        {
            // Initialize the database
            await _reportRepository.CreateOrUpdateAsync(_report);
            await _reportRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _reportRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/reports/{_report.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var reportList = await _reportRepository.GetAllAsync();
            reportList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Report));
            var report1 = new Report
            {
                Id = 1L
            };
            var report2 = new Report
            {
                Id = report1.Id
            };
            report1.Should().Be(report2);
            report2.Id = 2L;
            report1.Should().NotBe(report2);
            report1.Id = 0L;
            report1.Should().NotBe(report2);
        }
    }
}
