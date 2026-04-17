import type { HelpCenterCategory } from '@/features/help-center/types'

export const helpCenterCategories: HelpCenterCategory[] = [
    {
        slug: 'start',
        name: 'Start',
        articles: [
            {
                slug: 'registration-account-set-up',
                title: 'Registration & Account set up',
                subtitle: 'Account Registration Process',
                category: 'Start',
                categorySlug: 'start',
                qas: [
                    {
                        question: 'Can other users be registered on an account?',
                        answer: [
                            'Yes - additional logins can be created by selecting “Add New User” in the User Management section of Settings.',
                            'Additional users will have the same view as the administrator (original account holder) but will not be able to change any account settings or settings for other users.'
                        ]
                    },
                    {
                        question: 'Can the pickup location be changed?',
                        answer: [
                            'Yes - pick up addresses can be managed in Settings.'
                        ]
                    }
                ]
            }
        ]
    }
]

export const helpCenterArticles = helpCenterCategories.flatMap(
    (category) => category.articles
)