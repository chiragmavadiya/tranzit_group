import type { Customer } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: '1',
        name: 'Chirag Mavadiya',
        email: 'chiragwork14@gmail.com',
        mobile: '0423695224',
        business_name: 'test',
        customer_id: 'TRG69D886F9E6F82',
        created_at: '10 Apr 2026, 10:43 AM',
        last_login_at: null,
        suburb: 'Melbourne',
        state: 'VIC',
        status: 'active',
        avatar_color: 'bg-cyan-500'
    },
    {
        id: '2',
        name: 'My Name',
        email: 'shikharshiksh+1@gmail.com',
        mobile: '0423895225',
        business_name: 'Business Name',
        customer_id: 'TRG898EB7C284026',
        created_at: '20 Jan 2026, 4:27 AM',
        last_login_at: '20 Jan 2026, 9:59 AM',
        suburb: 'Footscray',
        state: 'VIC',
        status: 'active',
        avatar_color: 'bg-indigo-500'
    },
    {
        id: '3',
        name: 'Shikhar1 Chokshi2',
        email: 'shikhar6@yopmail.com',
        mobile: '-',
        business_name: '-',
        customer_id: '-',
        created_at: '19 Jan 2026, 10:18 AM',
        last_login_at: '19 Jan 2026, 3:50 PM',
        suburb: '-',
        state: '-',
        status: 'active',
        avatar_color: 'bg-emerald-500'
    },
    {
        id: '4',
        name: 'Deval Patel',
        email: 'devalpatel@yopmail.com',
        mobile: '-',
        business_name: '-',
        customer_id: '-',
        created_at: '16 Jan 2026, 11:11 AM',
        last_login_at: null,
        suburb: '-',
        state: '-',
        status: 'active',
        avatar_color: 'bg-blue-500'
    },
    {
        id: '5',
        name: 'Ashish Tukadiya',
        email: 'ashishtukadiya2627h@gmail.com',
        mobile: '0423695224',
        business_name: 'Business Name',
        customer_id: 'TRG697CAD880CD0E',
        created_at: '05 Jan 2026, 11:04 AM',
        last_login_at: null,
        suburb: 'Melbourne',
        state: 'VIC',
        status: 'active',
        avatar_color: 'bg-cyan-600'
    },
    {
        id: '6',
        name: 'Ashish Tukadiya',
        email: 'ashishtukadiya007@gmail.com',
        mobile: '0456235689',
        business_name: 'demo',
        customer_id: 'TRG697B65961FAD8',
        created_at: '01 Jan 2026, 12:19 PM',
        last_login_at: '30 Jan 2026, 12:49 AM',
        suburb: 'Broke',
        state: 'NSW',
        status: 'active',
        avatar_color: 'bg-indigo-600'
    },
    {
        id: '7',
        name: 'ashish tukadiya',
        email: 'ashish.tukadiya@magecurious.com',
        mobile: '-',
        business_name: '-',
        customer_id: '-',
        created_at: '01 Jan 2026, 12:14 PM',
        last_login_at: null,
        suburb: '-',
        state: '-',
        status: 'active',
        avatar_color: 'bg-emerald-600'
    }
];

export const SUBURBS = ['Melbourne', 'Footscray', 'Broke', 'Sydney', 'Brisbane'];
export const STATES = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS'];
