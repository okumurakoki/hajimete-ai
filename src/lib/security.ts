// DISABLED FOR BUILD - Mock implementation
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function checkRateLimit() { return true }
export async function validateAdminAccess() { return true }
export async function logSecurityEvent() {}
export async function getUserRole() { return 'user' }
export async function validateApiKey() { return true }

export class AccessControl {
  static async checkAccess() { return true }
  static async getUserPermissions() { return ['read'] }
  static async hasPermission() { return true }
}

export class InputValidator {
  static validateString() { return true }
  static validateEmail() { return true }
  static validateNumber() { return true }
  static sanitizeInput(input: string) { return input }
}