// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-001
// User Story: Unit tests for AuthContext
// GxP Impact: YES - Authentication is critical
// Risk Level: HIGH
// ============================================================================

import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '../services/authService';

// Mock the auth service
jest.mock('../services/authService');

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should initialize with no user when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should login successfully with valid credentials', async () => {
    const mockUser = { id: 1, username: 'testuser', role: 'Engineer' };
    authService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token'
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'password');
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('should handle login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBeTruthy();
    expect(result.current.user).toBeNull();
  });

  test('should logout successfully', async () => {
    const mockUser = { id: 1, username: 'testuser', role: 'Engineer' };
    authService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token'
    });
    authService.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Login first
    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    expect(result.current.user).toEqual(mockUser);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    spy.mockRestore();
  });
});
