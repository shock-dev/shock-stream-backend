import React from 'react'
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Link,
    Button,
    Preview
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface ResetPasswordTemplateProps {
    username: string
    resetUrl: string
    ip?: string
    device?: string
    location?: string
}

export default function ResetPasswordTemplate({
    username,
    resetUrl,
    ip,
    device,
    location
}: ResetPasswordTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Запрос на сброс пароля</Preview>

            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-6 shadow">
                        <Section className="text-center">
                            <Text className="text-2xl font-bold text-gray-900">
                                Сброс пароля
                            </Text>
                        </Section>

                        <Section className="mt-4">
                            <Text className="text-gray-700">
                                Привет,
                                <span className="font-semibold">
                                    {username}
                                </span>
                                👋
                            </Text>

                            <Text className="text-gray-700">
                                Мы получили запрос на сброс пароля для вашего
                                аккаунта. Если это были вы — нажмите кнопку
                                ниже.
                            </Text>
                        </Section>

                        <Section className="my-6 text-center">
                            <Button
                                href={resetUrl}
                                className="rounded-md bg-red-600 px-6 py-3 font-semibold text-white"
                            >
                                Сбросить пароль
                            </Button>
                        </Section>

                        {(ip || device || location) && (
                            <Section className="mt-4 rounded-md bg-gray-50 p-4">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
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

                        <Section className="mt-4">
                            <Text className="text-sm text-gray-500">
                                Если вы не запрашивали сброс пароля, рекомендуем
                                срочно сменить пароль и связаться с поддержкой.
                            </Text>
                        </Section>

                        <Section className="mt-6 border-t pt-4">
                            <Text className="text-xs text-gray-400 text-center">
                                Если кнопка не работает, используйте ссылку:
                            </Text>

                            <Link
                                href={resetUrl}
                                className="break-all text-xs text-blue-600 text-center"
                            >
                                {resetUrl}
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
