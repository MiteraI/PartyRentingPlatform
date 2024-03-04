const API_BOOKING = {
    admin: {},
    host: {
        GETBOOKINGS: "api/bookings/host",
        GETBOOKING: "api/bookings/customer",
        UPDATEBOOKING: "api/bookings/customer/",
        ACCEPTBOOKING: "api/bookings", // api/bookings/{id}/accept
        REJECTBOOKING: "api/bookings"// api/bookings/{id}/reject
    },
    customer: {}
}

export default API_BOOKING