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

export default function AccountDeletionTemplate() {
    return (
        <Html>
            <Head />
            <Preview>Аккаунт удалён</Preview>

            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-6 shadow">
                        <Section>
                            <Text className="text-xl font-semibold text-gray-900">
                                Аккаунт удалён
                            </Text>
                        </Section>

                        <Section className="mt-4">
                            <Text className="text-gray-700">
                                Аккаунт был окончательно удалён.
                            </Text>

                            <Text className="text-gray-700">
                                Все связанные с ним данные больше не доступны.
                            </Text>
                        </Section>

                        <Section className="mt-6 border-t pt-4">
                            <Text className="text-xs text-gray-400 text-center">
                                Это автоматическое уведомление.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
