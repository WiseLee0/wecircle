import compress from '@utils/compress'
export const ImgMixin = {
  methods: {
    /**
     * 图片压缩
     */
    processFile (file, next) {
      compress(file, {
        compress: {
          width: 400,
          height: 400,
          quality: 0.8
        }
      }, next)
    },
    /**
     * 添加base64
     */
    fileSubmitted (file) {
      file.base64Value = file.file.base64
    }
  }
}