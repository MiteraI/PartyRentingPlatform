// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Dto.Booking;
using PartyRentingPlatform.Hubs.Interfaces;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Hubs
{
    [Authorize]
    public class NotificationHub : Hub, INotificationHub
    {
        private static Dictionary<string, string> userConnections = new Dictionary<string, string>();
        private readonly IMapper _mapper;
        private readonly IHubContext<NotificationHub> _context;
        public NotificationHub(IMapper mapper, IHubContext<NotificationHub> context)
        {
            _mapper = mapper;
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirst(ClaimTypes.Name).Value;
            if (!userConnections.ContainsKey(userId))
            {
                userConnections.Add(userId, Context.ConnectionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User.FindFirst(ClaimTypes.Name).Value;
            if (userConnections.ContainsKey(userId))
            {
                userConnections.Remove(userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendNotificationToUser(string userId, Notification notification)
        {
            if (userConnections.TryGetValue(userId, out var connectionId))
            {
                await _context.Clients.Client(connectionId).SendAsync("ReceiveNotification", notification);
            }
        }

        private async Task SendMessageToUser(string userId, Notification notification)
        {
            if (userConnections.TryGetValue(userId, out var connectionId))
            {
                await _context.Clients.Client(connectionId).SendAsync("ReceiveMessage", notification);
            }
        }
    }
}
