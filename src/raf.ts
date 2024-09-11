export function cancelableRaf(callback: FrameRequestCallback): () => void {
  const requestId = window.requestAnimationFrame(callback)
  return () => window.cancelAnimationFrame(requestId)
}

export function loopRequestAnimationFrame(
  callback: FrameRequestCallback,
): () => void {
  let stopLoop = (): void => undefined

  function reqOneTime(): void {
    stopLoop = cancelableRaf((...args) => {
      callback(...args)
      reqOneTime()
    })
  }

  reqOneTime()

  return () => stopLoop()
}
