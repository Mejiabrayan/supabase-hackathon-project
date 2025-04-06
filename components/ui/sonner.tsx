"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#151517",
          "--normal-text": "rgb(59 130 246)",
          "--normal-border": "rgba(255,255,255,0.15)",
          "--success-bg": "linear-gradient(45deg,#161618 41.67%,#212123 41.67%,#212123 50%,#161618 50%,#161618 91.67%,#212123 91.67%,#212123 100%)",
          "--success-border": "#161618",
          "--success-text": "rgb(59 130 246)",
          "--border-radius": "26px",
          "--font-size": "1rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
