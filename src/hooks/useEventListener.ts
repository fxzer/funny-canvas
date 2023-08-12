import { onMounted, onUnmounted } from 'vue'

export default function useEventListener(target: EventTarget, event: string, callback: any) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
