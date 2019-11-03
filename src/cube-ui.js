import Vue from 'vue'

// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  Style,
  // basic
  Button,
  Loading,
  Tip,
  // form
  Input,
  Textarea,
  Select,
  Validator,
  Upload,
  // popup
  Toast,
  Dialog,
  ImagePreview,
  // scroll
  Scroll,
} from 'cube-ui'

Vue.use(Button)
Vue.use(Loading)
Vue.use(Tip)
Vue.use(Input)
Vue.use(Textarea)
Vue.use(Select)
Vue.use(Validator)
Vue.use(Upload)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(ImagePreview)
Vue.use(Scroll)
