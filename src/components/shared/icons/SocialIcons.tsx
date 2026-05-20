interface IconProps {
  size?: number
  className?: string
}

export function InstagramIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.486 2 2 6.486 2 12c0 1.756.452 3.475 1.314 4.997L2 22l5.122-1.286A9.95 9.95 0 0 0 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2Zm0 18a7.96 7.96 0 0 1-4.114-1.142l-.295-.176-3.04.763.78-2.96-.193-.305A7.964 7.964 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Zm4.36-5.97c-.241-.121-1.426-.703-1.647-.783-.221-.08-.382-.121-.542.121-.161.241-.621.783-.762.943-.141.161-.281.181-.522.06-.241-.12-1.018-.375-1.939-1.197-.717-.64-1.201-1.43-1.342-1.671-.141-.241-.015-.371.106-.491.109-.108.241-.281.362-.422.121-.141.161-.241.241-.402.08-.161.04-.302-.02-.422-.06-.121-.542-1.305-.742-1.787-.196-.469-.394-.405-.542-.412-.141-.007-.302-.009-.462-.009a.886.886 0 0 0-.642.302c-.221.241-.842.823-.842 2.007 0 1.184.862 2.327.983 2.488.121.161 1.696 2.59 4.107 3.632.574.248 1.022.396 1.371.508.576.183 1.1.157 1.514.095.462-.069 1.426-.583 1.627-1.146.201-.563.201-1.045.141-1.146-.06-.101-.221-.161-.462-.282Z" />
    </svg>
  )
}

export function TikTokIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.8a4.85 4.85 0 0 1-1-.11z" />
    </svg>
  )
}
