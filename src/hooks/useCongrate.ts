import confetti from 'canvas-confetti'

export function useCongratPass(count: number = 80) {
  const defaults = {
    colors: ['#5D8C7B', '#F2D091', '#F2A679', '#D9695F', '#8C4646'],
    shapes: ['square'],
    ticks: 500,
  } as confetti.Options
  confetti({
    ...defaults,
    particleCount: count,
    spread: 100,
    origin: { y: 0 },
  })
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50 + (count - 80),
      angle: 60,
      spread: 50,
      origin: { x: 0 },
    })
  }, 250)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50 + (count - 80),
      angle: 120,
      spread: 50,
      origin: { x: 1 },
    })
  }, 400)
}
