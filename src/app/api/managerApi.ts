import { apiRequest } from './baseApi';

export interface AdminUser {
    id: number;
    userId: number;
    name: string;
    email: string;
    city: string;
    businessName: string;
    businessAddress: string;
    gstNumber: string;
}

export interface GetAdminsResponse {
    content: AdminUser[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface CreateAdminRequest {
    name: string;
    email: string;
    phone: string;
    city: string;
    businessName: string;
    businessAddress: string;
    gstNumber: string;
}

export interface AdminService {
    id: number;
    name: string;
    location: string;
    city: string;
    latitude: number;
    longitude: number;
    description: string;
    contactNumber: string;
    availability: boolean;
    amenities: string[];
    images: string[];
    activities: (string | ServiceActivity)[];
}

export interface GetAdminServicesResponse {
    content: AdminService[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ServiceActivity {
    id: number;
    code: string;
    name: string;
    enabled: boolean;
}

export interface ServiceResource {
    id: number;
    serviceId: number;
    serviceName: string;
    name: string;
    description: string;
    enabled: boolean;
    activities: ServiceActivity[];
}

export interface UpdateServiceRequest {
    name: string;
    location: string;
    city: string;
    latitude: number;
    longitude: number;
    description: string;
    contactNumber: string;
    availability: boolean;
}

export interface AddServiceRequest {
    name: string;
    location: string;
    city: string;
    latitude: number;
    longitude: number;
    description: string;
    contactNumber: string;
    activityCodes: string[];
    amenities: string[];
}

export interface AddResourceRequest {
    serviceId: number;
    name: string;
    description: string;
    enabled: boolean;
    openingTime: string;
    closingTime: string;
    slotDurationMinutes: number;
    basePrice: number;
    activityCodes: string[];
}

export interface PendingBooking {
    id: number;
    reference: string;
    serviceId: number;
    serviceName: string;
    resourceId: number;
    resourceName: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    amount: number;
    status: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        email: string | null;
    };
}

export interface GetPendingBookingsResponse {
    content: PendingBooking[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface AllBooking {
    id: number;
    reference: string;
    serviceId: number;
    serviceName: string;
    resourceId: number;
    resourceName: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    createdAt: string;
    amountBreakdown: {
        slotSubtotal: number;
        platformFeePercent: number;
        platformFee: number;
        totalAmount: number;
        currency: string;
    };
    bookingType: string | null;
    message: string | null;
    childBookings: any;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    user: {
        id: number;
        name: string;
        email: string | null;
    };
}

export interface GetAllBookingsResponse {
    content: AllBooking[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ResourceSlot {
    slotId: string;
    startTime: string;
    endTime: string;
    price: number;
    status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

export interface ResourceBooking {
    id: number;
    reference: string;
    serviceId: number;
    serviceName: string;
    resourceId: number;
    resourceName: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    status: string;
    user: {
        id: number;
        name: string;
    };
}

export interface WalletInfo {
    walletId: number;
    balance: number;
    status: string;
}

export interface AppUser {
    id: number;
    phone: string;
    email: string;
    name: string;
    role: string;
    enabled: boolean;
    createdAt: string;
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
}

export interface UserManagerResponse {
    content: AppUser[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}


export interface PriceRule {
    id: number;
    resourceId: number;
    resourceName: string;
    dayType: 'WEEKDAY' | 'WEEKEND' | string;
    startTime: string;
    endTime: string;
    basePrice: number;
    extraCharge: number;
    reason: string;
    priority: number;
    enabled: boolean;
}

export interface ResourceConfig {
    id: number;
    resourceId: number;
    resourceName: string;
    openingTime: string;
    closingTime: string;
    slotDurationMinutes: number;
    basePrice: number;
    enabled: boolean;
    totalSlots: number;
}

export interface UpdateResourceConfigRequest {
    resourceId: number;
    openingTime: string;
    closingTime: string;
    slotDurationMinutes: number;
    basePrice: number;
}

export interface AddPriceRuleRequest {
    resourceId: number;
    dayType: 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY' | 'ALL';
    startTime: string;
    endTime: string;
    basePrice?: number;
    extraCharge: number;
    reason: string;
    priority: number;
}

export interface UpdatePriceRuleRequest {
    dayType: 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY' | 'ALL';
    startTime: string;
    endTime: string;
    basePrice?: number;
    extraCharge: number;
    reason: string;
    priority: number;
    enabled: boolean;
}

export interface ResourceRevenue {
    resourceId: number;
    resourceName: string;
    bookingCount: number;
    totalRevenue: number;
    averageRevenuePerBooking: number;
}

export interface ServiceRevenue {
    serviceId: number;
    serviceName: string;
    totalBookings: number;
    totalRevenue: number;
    averageRevenuePerBooking: number;
    resourceRevenues: ResourceRevenue[];
}

export interface AdminRevenueResponse {
    adminId: number;
    adminName: string;
    totalBookings: number;
    totalRevenue: number;
    averageRevenuePerBooking: number;
    serviceRevenues: ServiceRevenue[];
    generatedAt: string;
    currency: string;
}

export interface InvoiceTemplate {
    id: number;
    name: string;
    content: string;
    version: number;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInvoiceTemplateRequest {
    name: string;
    content: string;
}

export interface CreateActivityRequest {
    code: string;
    name: string;
}

export interface UpdateActivityRequest {
    code: string;
    name: string;
}

export const managerApi = {
    getActiveInvoiceTemplate: async (): Promise<InvoiceTemplate> => {
        return apiRequest<InvoiceTemplate>('/api/manager/invoice-template/active');
    },
    createInvoiceTemplate: async (data: CreateInvoiceTemplateRequest): Promise<InvoiceTemplate> => {
        return apiRequest<InvoiceTemplate>('/api/manager/invoice-template', {
            method: 'POST',
            data
        });
    },
    activateInvoiceTemplate: async (version: number): Promise<InvoiceTemplate> => {
        return apiRequest<InvoiceTemplate>(`/api/manager/invoice-template/activate/${version}`, {
            method: 'PUT'
        });
    },
    getInvoiceTemplateByVersion: async (version: number): Promise<InvoiceTemplate> => {
        return apiRequest<InvoiceTemplate>(`/api/manager/invoice-template/${version}`);
    },
    getAdmins: async (page: number, size: number): Promise<GetAdminsResponse> => {
        return apiRequest<GetAdminsResponse>(`/manager/admins?page=${page}&size=${size}`);
    },
    createAdmin: async (data: CreateAdminRequest): Promise<void> => {
        return apiRequest<void>('/manager/admins', { data });
    },
    getAdminServices: async (adminId: number, page: number = 0, size: number = 10): Promise<GetAdminServicesResponse> => {
        return apiRequest<GetAdminServicesResponse>(`/manager/admins/${adminId}/services?page=${page}&size=${size}`);
    },
    getServiceResources: async (serviceId: number): Promise<ServiceResource[]> => {
        return apiRequest<ServiceResource[]>(`/manager/services/${serviceId}/resources`);
    },
    updateService: async (serviceId: number, data: UpdateServiceRequest): Promise<AdminService> => {
        return apiRequest<AdminService>(`/manager/services/${serviceId}`, {
            method: 'PUT',
            data
        });
    },
    uploadServiceImages: async (serviceId: number, files: FileList): Promise<void> => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });
        return apiRequest<void>(`/manager/services/${serviceId}/images`, {
            method: 'POST',
            data: formData
        });
    },
    deleteServiceImages: async (serviceId: number, imageUrls: string[]): Promise<void> => {
        return apiRequest<void>(`/manager/services/${serviceId}/images`, {
            method: 'DELETE',
            data: imageUrls
        });
    },
    createService: async (adminId: number, data: AddServiceRequest): Promise<AdminService> => {
        return apiRequest<AdminService>(`/manager/service-details/${adminId}`, {
            method: 'POST',
            data
        });
    },
    createResource: async (serviceId: number, data: AddResourceRequest): Promise<ServiceResource> => {
        return apiRequest<ServiceResource>(`/manager/services/${serviceId}/resources`, {
            method: 'POST',
            data
        });
    },
    getPendingBookings: async (page: number = 0, size: number = 10): Promise<GetPendingBookingsResponse> => {
        return apiRequest<GetPendingBookingsResponse>(`/manager/bookings/pending?page=${page}&size=${size}`);
    },
    approveBooking: async (bookingId: number): Promise<void> => {
        return apiRequest<void>(`/manager/bookings/${bookingId}/approve`, {
            method: 'PUT'
        });
    },
    getAllBookings: async (page: number = 0, size: number = 10): Promise<GetAllBookingsResponse> => {
        return apiRequest<GetAllBookingsResponse>(`/manager/bookings?page=${page}&size=${size}`);
    },
    cancelBooking: async (bookingId: number): Promise<void> => {
        return apiRequest<void>(`/manager/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });
    },
    getResourceBookings: async (resourceId: number, date: string): Promise<any> => {
        return apiRequest<any>(`/manager/resources/${resourceId}/bookings?bookingDate=${date}`);
    },
    getResourceSlots: async (resourceId: number, date: string): Promise<ResourceSlot[]> => {
        return apiRequest<ResourceSlot[]>(`/manager/resources/${resourceId}/slots?date=${date}`);
    },
    getUsers: async (page: number = 0, size: number = 10): Promise<UserManagerResponse> => {
        return apiRequest<UserManagerResponse>(`/manager/users?page=${page}&size=${size}`);
    },
    getUserBookings: async (userId: number, page: number = 0, size: number = 10): Promise<GetAllBookingsResponse> => {
        return apiRequest<GetAllBookingsResponse>(`/manager/users/${userId}/bookings?page=${page}&size=${size}`);
    },
    getBookingById: async (bookingId: number): Promise<AllBooking> => {
        return apiRequest<AllBooking>(`/manager/booking/${bookingId}`);
    },
    getPriceRules: async (resourceId: number): Promise<PriceRule[]> => {
        return apiRequest<PriceRule[]>(`/manager/${resourceId}/price-rules`);
    },
    getResourceConfig: async (resourceId: number): Promise<ResourceConfig> => {
        return apiRequest<ResourceConfig>(`/manager/${resourceId}/config`);
    },
    updateResourceConfig: async (data: UpdateResourceConfigRequest): Promise<ResourceConfig> => {
        return apiRequest<ResourceConfig>('/manager/resources/slot-config', {
            method: 'POST',
            data
        });
    },
    addPriceRule: async (data: AddPriceRuleRequest): Promise<PriceRule> => {
        return apiRequest<PriceRule>('/manager/resources/price-rules', {
            method: 'POST',
            data
        });
    },
    updatePriceRule: async (ruleId: number, data: UpdatePriceRuleRequest): Promise<PriceRule> => {
        return apiRequest<PriceRule>(`/manager/resources/price-rules/${ruleId}`, {
            method: 'POST',
            data
        });
    },
    deletePriceRule: async (ruleId: number): Promise<void> => {
        return apiRequest<void>(`/manager/resources/price-rules/${ruleId}`, {
            method: 'DELETE'
        });
    },
    getAdminRevenue: async (adminId: number): Promise<AdminRevenueResponse> => {
        return apiRequest<AdminRevenueResponse>(`/manager/admins/${adminId}/revenue`);
    },
    getActivities: async (): Promise<ServiceActivity[]> => {
        return apiRequest<ServiceActivity[]>('/manager/activities');
    },
    createActivity: async (data: CreateActivityRequest): Promise<ServiceActivity> => {
        return apiRequest<ServiceActivity>('/manager/activities', {
            method: 'POST',
            data
        });
    },
    updateActivity: async (id: number, data: UpdateActivityRequest): Promise<ServiceActivity> => {
        return apiRequest<ServiceActivity>(`/manager/activities/${id}`, {
            method: 'PUT',
            data
        });
    },
    deleteActivity: async (id: number): Promise<string> => {
        return apiRequest<string>(`/manager/activities/${id}`, {
            method: 'DELETE'
        });
    },
    enableActivity: async (id: number): Promise<void> => {
        return apiRequest<void>(`/manager/activities/${id}/enable`, {
            method: 'PATCH'
        });
    },
    disableActivity: async (id: number): Promise<void> => {
        return apiRequest<void>(`/manager/activities/${id}/disable`, {
            method: 'PATCH'
        });
    }
};
