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

interface VerificationTemplateProps {
    username: string
    verifyUrl: string
}

export default function VerificationTemplate({
    username,
    verifyUrl
}: VerificationTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Подтвердите вашу почту</Preview>

            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-6 shadow">
                        <Section className="text-center">
                            <Text className="text-2xl font-bold text-gray-900">
                                Подтверждение почты
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
                                Спасибо за регистрацию. Нажмите кнопку ниже,
                                чтобы подтвердить адрес электронной почты.
                            </Text>
                        </Section>

                        <Section className="my-6 text-center">
                            <Button
                                href={verifyUrl}
                                className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold"
                            >
                                Подтвердить почту
                            </Button>
                        </Section>

                        <Section>
                            <Text className="text-sm text-gray-500">
                                Если кнопка не работает, скопируйте и вставьте
                                ссылку в браузер:
                            </Text>

                            <Link
                                href={verifyUrl}
                                className="break-all text-sm text-blue-600"
                            >
                                {verifyUrl}
                            </Link>
                        </Section>

                        <Section className="mt-6 border-t pt-4">
                            <Text className="text-xs text-gray-400 text-center">
                                Если вы не регистрировались — просто
                                проигнорируйте это письмо.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
