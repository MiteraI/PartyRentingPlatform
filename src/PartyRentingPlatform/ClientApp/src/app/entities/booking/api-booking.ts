const API_BOOKING = {
    admin: {},
    host: {
        GETBOOKINGS: "api/bookings/host",
        GETBOOKINGDETAIL: "api/bookings/host/details",
        UPDATEBOOKING: "api/bookings/customer/",
        ACCEPTBOOKING: "api/bookings", // api/bookings/{id}/accept
        REJECTBOOKING: "api/bookings",// api/bookings/{id}/reject,
        GETBOOKINGSBYSTATUS: "api/bookings/host"
    },
    customer: {}
}

export default API_BOOKING