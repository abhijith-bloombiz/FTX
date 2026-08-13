import { ContactFormData, ContactFormResponse } from "@/types/contact";

export function validateContactForm(data: Partial<ContactFormData>): ContactFormResponse {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!data.name || data.name.trim().length < 2) {
        errors.name = "Please enter your full name (minimum 2 characters).";
    }

    if (!data.phone || !/^[+\d\s-]{7,18}$/.test(data.phone.trim())) {
        errors.phone = "Please enter a valid phone number.";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = "Please enter a valid email address.";
    }

    if (!data.vehicleModel || data.vehicleModel.trim().length < 2) {
        errors.vehicleModel = "Please specify your vehicle make and model (e.g. Porsche 911 GT3).";
    }

    if (!data.service || data.service.trim() === "") {
        errors.service = "Please select a service.";
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    return {
        success: true,
    };
}
