import { Button as HeroButton } from 'heroui-native'

export interface ButtonProps {
  children: string
  onPress?: () => void
  disabled?: boolean
}

export function Button({ children, onPress, disabled = false }: ButtonProps) {
  return (
    <HeroButton onPress={onPress} isDisabled={disabled}>
      <HeroButton.Label>{children}</HeroButton.Label>
    </HeroButton>
  )
}
