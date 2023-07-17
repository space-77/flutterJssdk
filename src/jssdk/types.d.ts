export type Image = {
  path: string
  title: string
  width: number
  height: number
  mimeType: string
}

export type PickerPhotoParams = {
  /**
   * @default 9
   * @description 最多选择的图片数量
   */
  maxAssets?: number

  /**
   * @default '#00bc56'
   * @description 选择器的主题色(hex string)
   */
  themeColor?: string

  /**
   * @default 'common'
   * @description 选择器选择资源的类型
   */
  requestType?: 'all' | 'audio' | 'image' | 'video' | 'common'

  /**
   * @description 已选的资源id集合, 确保不重复选择
   */
  selectedAssetIds?: string[]

  /**
   * @default false
   * @description 选择器是否可以从同样的位置开始选择
   */
  keepScrollOffset?: boolean
}

export type CameraPhotoParams = {
  /**
   * @default true
   * @description 选择器是否需要录制音频。只在 enableRecording 为 true 时有效
   */
  enableAudio?: boolean

  /**
   * @default false
   * @description 选择器是否可以录像
   */
  enableRecording?: boolean

  /**
   * @default false
   * @description 选择器是否可以单击录像。只在 onlyEnableRecording 为 true 时生效
   */
  enableTapRecording?: boolean

  /**
   * @default false
   * @description 选择器是否仅可以录像。只在 enableRecording 为 true 时有效。
   */
  onlyEnableRecording?: boolean

  /**
   * @default 1
   * @description 录制视频最短时长(单位秒)
   */
  minimumRecordingDuration?: boolean

  /**
   * @default 15
   * @description 录制视频最长时长(单位秒)
   */
  maximumRecordingDuration?: boolean
}
