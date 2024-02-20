// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Azure.Storage;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using PartyRentingPlatform.Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly IConfiguration _configuration;
        private readonly BlobContainerClient _roomImageContainerClient;
        private readonly string _azureBlobStorageAccountName;
        private readonly string _azureBlobStorageKey;
        public AzureBlobService(IConfiguration configuration)
        {
            _configuration = configuration;

            //Azure Credentials
            _azureBlobStorageAccountName = configuration.GetValue<string>("AzureBlobStorageAccountName");
            _azureBlobStorageKey = configuration.GetValue<string>("AzureBlobStorageKey");
            var azureCredentials = new StorageSharedKeyCredential(_azureBlobStorageAccountName, _azureBlobStorageKey);

            var blobUri = new Uri($"https://{_azureBlobStorageAccountName}.blob.core.windows.net");
            var blobServiceClient = new BlobServiceClient(blobUri, azureCredentials);

            //Azure Container Clients
            _roomImageContainerClient = blobServiceClient.GetBlobContainerClient("room-images");
        }
    }
}
