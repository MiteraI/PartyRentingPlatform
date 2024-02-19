// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using JHipsterNet.Core.Pagination;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using PartyRentingPlatform.Crosscutting.Utilities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services
{
    public class VnpayService : IVnpayService
    {
        public const string VERSION = "2.1.0";
        public const string vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        public const string vnp_Api = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
        private SortedList<String, String> _requestData = new SortedList<String, String>(new VnPayCompare());
        //private SortedList<String, String> _responseData = new SortedList<String, String>(new VnPayCompare());
        private IConfiguration _configuration;

        public VnpayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreateVnpayPortalUrl(double price, string returnUrl, HttpContext httpContext)
        {
            //Mock returnUrl, front-end will handle this in future -> return back to the page that user was on
            returnUrl = _configuration.GetValue<string>("vnp_ReturnUrl");
            _requestData.Add("vnp_Amount", (price * 100).ToString());
            _requestData.Add("vnp_Command", "pay");
            _requestData.Add("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            _requestData.Add("vnp_CurrCode", "VND");
            _requestData.Add("vnp_IpAddr", GetIpAddress(httpContext));
            _requestData.Add("vnp_Locale", "vn");
            _requestData.Add("vnp_OrderInfo", "Thanh toán hóa đơn");
            _requestData.Add("vnp_OrderType", "billpayment");
            _requestData.Add("vnp_ReturnUrl", returnUrl);
            _requestData.Add("vnp_TmnCode", _configuration.GetValue<string>("vnp_TmnCode"));
            _requestData.Add("vnp_TxnRef", DateTime.Now.Ticks.ToString());
            _requestData.Add("vnp_Version", VERSION);
            _requestData.Add("vnp_BankCode", "VNBANK");

            return CreateVnpayUrl(vnp_Url, _configuration.GetValue<string>("vnp_HashSecret"));
        }

        private string CreateVnpayUrl(string baseUrl, string vnp_HashSecret)
        {
            StringBuilder data = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }
            string queryString = data.ToString();

            baseUrl += "?" + queryString;
            string signData = queryString;
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }
            string vnp_SecureHash = VnpayUtil.HmacSHA512(vnp_HashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        private static string GetIpAddress(HttpContext httpContext)
        {
            string ipAddress = string.Empty;
            try
            {
                ipAddress = httpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

                if (string.IsNullOrEmpty(ipAddress) || (ipAddress.ToLower() == "unknown") || ipAddress.Length > 45)
                    ipAddress = "127.0.0.1";
            }
            catch (Exception ex)
            {
                ipAddress = "Invalid IP:" + ex.Message;
            }

            return ipAddress;
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}
