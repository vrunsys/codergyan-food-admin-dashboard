import { queries } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { vi, beforeEach } from 'vitest'

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

beforeEach(() => {
  const matchMediaMock = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  const computedStyleMock = vi.fn().mockImplementation(() => ({}));
  vi.stubGlobal('matchMedia', matchMediaMock)
  vi.stubGlobal('computedStyle', computedStyleMock)
  
})