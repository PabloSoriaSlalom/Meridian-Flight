declare module 'feather-icons' {
  interface FeatherIcon {
    name: string
    contents: string
    tags: string[]
    attrs: {
      xmlns: string
      width: string | number
      height: string | number
      viewBox: string
      fill: string
      stroke: string
      'stroke-width': string | number
      'stroke-linecap': string
      'stroke-linejoin': string
    }
    toSvg(attrs?: Record<string, string | number>): string
  }

  const icons: Record<string, FeatherIcon>
  export { icons }
}
