'use server'

import { headers } from "next/headers"

const CONTACT_SUBJECT = "Contact Form glaucodeveloper.com site"
const CONTACT_TO = "glauco.developer@gmail.com"
const MIN_FILL_MS = 3_000
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 3

type RateLimitEntry = {
  count: number
  firstAttemptAt: number
}

const submissions = new Map<string, RateLimitEntry>()

export type ContactFormState = {
  error?: string
  success?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = readField(formData, "name")
  const email = readField(formData, "email").toLowerCase()
  const subject = readField(formData, "subject")
  const country = readField(formData, "country")
  const message = readField(formData, "message")
  const company = readField(formData, "company")
  const startedAt = Number(readField(formData, "startedAt"))

  if (company) {
    return { success: "Message sent." }
  }

  if (!name || !email || !message) {
    return { error: "Preencha nome, email e mensagem." }
  }

  if (!isValidEmail(email)) {
    return { error: "Informe um email valido." }
  }

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { error: "Envio bloqueado. Tente novamente em alguns segundos." }
  }

  if (name.length > 120 || email.length > 160 || subject.length > 160 || country.length > 120) {
    return { error: "Alguns campos passaram do limite permitido." }
  }

  if (message.length < 20 || message.length > 4000) {
    return { error: "A mensagem precisa ter entre 20 e 4000 caracteres." }
  }

  if (looksSpammy(subject, message)) {
    return { error: "Nao foi possivel enviar essa mensagem." }
  }

  const requestHeaders = await headers()
  const fingerprint = getFingerprint(requestHeaders, email)

  if (isRateLimited(fingerprint)) {
    return { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar de novo." }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const contactFrom = process.env.CONTACT_FORM_FROM

  if (!resendApiKey || !contactFrom) {
    console.error("Missing contact form env", {
      hasResendApiKey: Boolean(resendApiKey),
      hasContactFrom: Boolean(contactFrom),
    })
    return { error: "Formulario indisponivel no momento." }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFrom,
      to: [CONTACT_TO],
      reply_to: email,
      subject: CONTACT_SUBJECT,
      text: buildEmailBody({ name, email, subject, country, message }),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Contact form email send failed", {
      status: response.status,
      body: errorText,
    })
    return { error: "Nao foi possivel enviar agora. Tente novamente em instantes." }
  }

  return { success: "Message sent." }
}

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function looksSpammy(subject: string, message: string) {
  const combined = `${subject}\n${message}`.toLowerCase()

  if ((combined.match(/https?:\/\//g) ?? []).length > 2) {
    return true
  }

  return /(crypto|casino|loan|viagra|seo service|buy now)/i.test(combined)
}

function getFingerprint(requestHeaders: Headers, email: string) {
  const forwardedFor = requestHeaders.get("x-forwarded-for") ?? "unknown-ip"
  const userAgent = requestHeaders.get("user-agent") ?? "unknown-agent"
  return `${forwardedFor.split(",")[0]?.trim()}:${userAgent}:${email}`
}

function isRateLimited(fingerprint: string) {
  const now = Date.now()

  for (const [key, entry] of submissions) {
    if (now - entry.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
      submissions.delete(key)
    }
  }

  const current = submissions.get(fingerprint)

  if (!current) {
    submissions.set(fingerprint, { count: 1, firstAttemptAt: now })
    return false
  }

  if (now - current.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    submissions.set(fingerprint, { count: 1, firstAttemptAt: now })
    return false
  }

  current.count += 1
  return current.count > RATE_LIMIT_MAX_REQUESTS
}

function buildEmailBody(input: {
  name: string
  email: string
  subject: string
  country: string
  message: string
}) {
  return [
    "New contact form submission",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject || "-"}`,
    `Country: ${input.country || "-"}`,
    "",
    "Message:",
    input.message,
  ].join("\n")
}
