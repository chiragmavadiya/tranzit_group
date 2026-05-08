import { Settings2, Mail, Truck, Layout, ShieldCheck, Globe } from "lucide-react";

export const SETTING_CATEGORIES = [
    {
        id: 'general',
        name: 'General Settings',
        icon: Settings2,
        slugs: ['site_name', 'site_description', 'contact_email', 'contact_phone']
    },
    {
        id: 'email',
        name: 'Email Configuration',
        icon: Mail,
        slugs: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'mail_from_address', 'mail_from_name']
    },
    {
        id: 'courier',
        name: 'Courier Settings',
        icon: Truck,
        slugs: ['default_courier', 'tracking_url_prefix', 'shipping_api_key']
    },
    {
        id: 'appearance',
        name: 'Appearance & UI',
        icon: Layout,
        slugs: ['logo_url', 'favicon_url', 'primary_color', 'dark_mode_enabled']
    },
    {
        id: 'security',
        name: 'Security & Auth',
        icon: ShieldCheck,
        slugs: ['enable_registration', 'require_email_verification', 'max_login_attempts']
    },
    {
        id: 'localization',
        name: 'Localization',
        icon: Globe,
        slugs: ['default_timezone', 'default_currency', 'default_language']
    }
] as const;
