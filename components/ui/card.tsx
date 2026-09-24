import type { ReactNode } from 'react'
import { Card as HeroCard } from 'heroui-native'

export interface CardProps {
  title?: string
  description?: string
  children?: ReactNode
}

export function Card({ title, description, children }: CardProps) {
  return (
    <HeroCard>
      {title === undefined ? null : <HeroCard.Title>{title}</HeroCard.Title>}
      {description === undefined ? null : <HeroCard.Description>{description}</HeroCard.Description>}
      {children}
    </HeroCard>
  )
}
