import { Chip as HeroChip } from 'heroui-native'

export function Chip({ children }: { children: string }) {
  return <HeroChip><HeroChip.Label>{children}</HeroChip.Label></HeroChip>
}
