import React from 'react'
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Preview
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface AccountDeactivationTemplateProps {
    username: string
    token: string

    ip?: string
    device?: string
    location?: string
}

export default function AccountDeactivationTemplate({
    username,
    token,
    ip,
    device,
    location
}: AccountDeactivationTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Подтверждение удаления аккаунта</Preview>

            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-6 shadow">
                        <Section className="text-center">
                            <Text className="text-2xl font-bold text-gray-900">
                                Аккаунт деактивирован
                            </Text>
                        </Section>

                        <Section className="mt-4">
                            <Text className="text-gray-700">
                                Привет,{' '}
                                <span className="font-semibold">
                                    {username}
                                </span>
                                .
                            </Text>

                            <Text className="text-gray-700">
                                Для подтверждения окончательного удаления
                                аккаунта введите следующий код:
                            </Text>
                        </Section>

                        <Section className="mt-6 text-center">
                            <Section className="rounded-md bg-gray-100 py-4">
                                <Text className="text-3xl font-mono font-bold tracking-widest text-gray-900">
                                    {token.replace(/(\d{3})(\d{3})/, '$1 $2')}
                                </Text>
                            </Section>

                            <Text className="mt-3 text-xs text-gray-500">
                                Никому не сообщайте этот код.
                            </Text>
                        </Section>

                        {(ip || device || location) && (
                            <Section className="mt-6 rounded-md bg-gray-50 p-4">
                                <Text className="mb-2 text-sm font-semibold text-gray-700">
                                    Детали запроса
                                </Text>

                                {ip && (
                                    <Text className="text-sm text-gray-600">
                                        🌐 IP-адрес: {ip}
                                    </Text>
                                )}

                                {location && (
                                    <Text className="text-sm text-gray-600">
                                        📍 Местоположение: {location}
                                    </Text>
                                )}

                                {device && (
                                    <Text className="text-sm text-gray-600">
                                        💻 Устройство: {device}
                                    </Text>
                                )}
                            </Section>
                        )}

                        <Section className="mt-6 border-t pt-4">
                            <Text className="text-xs text-gray-400 text-center">
                                Если вы не инициировали удаление аккаунта,
                                просто проигнорируйте это письмо.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
