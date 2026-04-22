import { useQuery } from '@tanstack/react-query';
import { helpCenterService } from '../services/help-center.service';
import { QUERY_KEYS } from '@/constants/api.constants';

export const useHelpCenterArticles = (search?: string) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.HELP_CENTER.LIST, search],
        queryFn: () => helpCenterService.getArticles(search),
    });
};

export const useHelpArticleDetails = (slug: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.HELP_CENTER.DETAILS(slug),
        queryFn: () => helpCenterService.getArticleDetails(slug),
        enabled: !!slug,
    });
};
