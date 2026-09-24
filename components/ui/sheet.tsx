import type { ReactNode } from 'react'
import { Modal, View } from 'react-native'
import { Button } from './button'
import { Card } from './card'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Native Modal also has a react-native-web implementation; no bottom-sheet native peer is required. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 p-4" accessibilityViewIsModal>
        <Card title={title}>
          {children}
          <Button onPress={onClose}>Close</Button>
        </Card>
      </View>
    </Modal>
  )
}
