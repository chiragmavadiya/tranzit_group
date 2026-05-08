import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { helpCenterService } from '../services/help-center.service';
import { QUERY_KEYS } from '@/constants/api.constants';

export const useHelpCenterArticles = (search?: string) => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const query = useQuery({
        queryKey: [...QUERY_KEYS.HELP_CENTER.LIST, search],
        queryFn: () => helpCenterService.getArticles(search),
    });

    useEffect(() => {
        // Automatically redirect to the first article if no slug is present in the URL
        if (query.isSuccess && !slug && query.data?.data?.[0]?.articles?.[0]?.slug) {
            navigate(`/help-center/${query.data.data[0].articles[0].slug}`, { replace: true });
        }
    }, [query.isSuccess, query.data, slug, navigate]);

    return query;
};

export const useHelpArticleDetails = (slug: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.HELP_CENTER.DETAILS(slug),
        queryFn: () => helpCenterService.getArticleDetails(slug),
        enabled: !!slug,
    });
};
