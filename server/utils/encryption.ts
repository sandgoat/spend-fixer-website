/**
 * AES-256-GCM encryption utilities for Plaid access tokens and other sensitive data.
 *
 * Setup: generate a key with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Set ENCRYPTION_KEY in your .env to the generated hex string.
 *
 * Encrypted format: iv:authTag:ciphertext (all hex-encoded, colon-separated)
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // 96-bit IV recommended for GCM

function getKey(): Buffer {
  const config = useRuntimeConfig()
  const keyHex = config.encryptionKey as string

  if (!keyHex) {
    throw new Error(
      'ENCRYPTION_KEY is not set. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }

  const keyBuffer = Buffer.from(keyHex, 'hex')
  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).')
  }

  return keyBuffer
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * @returns Encrypted string in `iv:authTag:ciphertext` format (hex-encoded)
 */
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':')
}

/**
 * Decrypts a string encrypted with `encrypt()`.
 * @param encrypted - String in `iv:authTag:ciphertext` format
 * @returns Original plaintext
 */
export function decrypt(encrypted: string): string {
  const key = getKey()
  const parts = encrypted.split(':')

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected iv:authTag:ciphertext')
  }

  const [ivHex, authTagHex, ciphertextHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const ciphertext = Buffer.from(ciphertextHex, 'hex')

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return decrypted.toString('utf8')
}

/**
 * Generates a random 32-byte (256-bit) hex key for use as ENCRYPTION_KEY.
 * For setup/documentation purposes only — do not call this at runtime.
 */
export function generateKey(): string {
  return randomBytes(32).toString('hex')
}
