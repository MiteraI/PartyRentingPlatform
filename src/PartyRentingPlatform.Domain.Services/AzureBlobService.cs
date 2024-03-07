// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Azure.Storage;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PartyRentingPlatform.Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace PartyRentingPlatform.Domain.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly IConfiguration _configuration;
        private readonly BlobContainerClient _roomImageContainerClient;
        private readonly BlobContainerClient _avatarContainerClient;
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
            _avatarContainerClient = blobServiceClient.GetBlobContainerClient("avatars");
        }

        public async Task<string> UploadAvatar(IFormFile image)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var blobClient = _avatarContainerClient.GetBlobClient(fileName);

            using (var stream = image.OpenReadStream())
            {
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream);
                    var imageBytes = memoryStream.ToArray();
                    await blobClient.UploadAsync(new MemoryStream(imageBytes));
                }
            }
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<string> UploadRoomImage(IFormFile image)
        {
            // Create blob client from file name from IFormFile image with guid
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var blobClient = _roomImageContainerClient.GetBlobClient(fileName);

            using (var stream = image.OpenReadStream())
            {
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream);
                    var imageBytes = memoryStream.ToArray();
                    await blobClient.UploadAsync(new MemoryStream(imageBytes));
                }
            }
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<IList<string>> UploadRoomImages(IList<IFormFile> image)
        {
            var imageUrls = new List<string>();
            if (image != null && image.Count > 0)
            {
                foreach (var img in image)
                {
                    imageUrls.Add(await UploadRoomImage(img));
                }
            }
            return imageUrls;
        }
    }
}
