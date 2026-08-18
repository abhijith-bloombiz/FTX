export interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    vehicleModel: string;
    service: string;
    package: string;
    message: string;
}

export interface ContactFormResponse {
    success: boolean;
    isValid?: boolean;
    message?: string;
    errors?: Partial<Record<keyof ContactFormData, string>>;
}
