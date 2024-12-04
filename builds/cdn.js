import {zValidation} from "../src/zValidation.js";

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(zValidation)
})