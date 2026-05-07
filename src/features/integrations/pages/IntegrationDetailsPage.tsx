import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { PROVIDERS } from '../constants'
import { IntegrationForm } from '../components/IntegrationForm'

const IntegrationDetailsPage: React.FC = () => {
    const { providerId } = useParams<{ providerId: string }>()

    const provider = PROVIDERS.find(p => p.id === providerId)

    if (!provider) {
        return <Navigate to="/integrations" replace />
    }

    return (
        <div className="p-6 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IntegrationForm provider={provider} />
        </div>
    )
}

export default IntegrationDetailsPage
