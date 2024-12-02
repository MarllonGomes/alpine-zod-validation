import {zValidate} from "../src/zValidate.js";

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(zValidate)
})