// config to make js cookie ts compatiable

declare module 'js-cookie' {
  import Cookies from 'js-cookie'
  export default Cookies
}
