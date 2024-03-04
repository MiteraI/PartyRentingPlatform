const API_BOOKING = {
    admin: {},
    host: {
        GETBOOKINGS: "api/bookings/host",
        ACCEPTBOOKING: "api/bookings", // api/bookings/{id}/accept
        REJECTBOOKING: "api/bookings",// api/bookings/{id}/reject,
        GETBOOKINGSBYSTATUS: "api/bookings/host"
    },
    customer: {}
}

export default API_BOOKING