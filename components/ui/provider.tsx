import type { PropsWithChildren } from 'react'
import { HeroUINativeProvider } from 'heroui-native'

/** Keep provider ownership with the components so the native kit can be replaced together. */
export function UIProvider({ children }: PropsWithChildren) {
  return <HeroUINativeProvider>{children}</HeroUINativeProvider>
}
