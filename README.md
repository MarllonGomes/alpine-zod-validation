# Alpine.js Zod Validation

🚀 A powerful integration between [Alpine.js](https://www.npmjs.com/package/alpinejs) and [Zod](https://www.npmjs.com/package/zod) for seamless form validation. Define validation schemas using Zod and apply them directly in your Alpine.js components with minimal effort.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Advanced Features](#advanced-features)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### NPM + Bundler

```bash
npm install @mfgomess/alpine-zod-validation
```

Import and initialize:

```javascript
import Alpine from 'alpinejs';
import { zValidation } from '@mfgomess/alpine-zod-validation';

window.Alpine = Alpine;
Alpine.plugin(zValidation);
Alpine.start();
```

### CDN

```html
<script type="module" defer src="https://unpkg.com/@mfgomess/alpine-zod-validation/dist/cdn.js"></script>
<script src="//unpkg.com/alpinejs" defer></script>
```

## 🚦 Quick Start

Here's a simple example to get you started:

```html
<form
    x-data="{
        email: '',
        password: '',
        zSchema: $z.object({
            email: $z.string().email(),
            password: $z.string().min(8)
        })
    }"
    x-zvalidation
    @submit.prevent="zValidate() && $event.target.submit()"
>
    <input 
        type="email" 
        x-model="email"
        :class="{ 'error': zIsInvalid('email') }"
    />
    <span x-show="zIsInvalid('email')" x-text="zFirstErrorFor('email')"></span>

    <input 
        type="password" 
        x-model="password"
        :class="{ 'error': zIsInvalid('password') }"
    />
    <span x-show="zIsInvalid('password')" x-text="zFirstErrorFor('password')"></span>

    <button type="submit" :disabled="zHasErrors()">Submit</button>
</form>
```

## 🎯 Core Concepts

### Directives

| Directive | Description |
|-----------|-------------|
| `x-zvalidation` | Main directive to enable validation on a component |
| `.listen` | Modifier to validate on specific events (e.g., `x-zvalidation.listen="change"`) |
| `.reactive` | Enables real-time validation after first error |
| `.entangled` | Syncs with Livewire validation errors |

### Magic Properties

- `$z`: Direct access to Zod for schema definition

## 📚 API Reference

### Validation Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `zValidate()` | - | `boolean` | Validates entire form against schema. Returns `true` if valid. |
| `zValidateOnly(field)` | `string` | `boolean` | Validates a single field. Returns `true` if valid. |
| `zIsFormValid()` | - | `boolean` | Silently Checks if entire form is currently valid without triggering errors (usefull to enable/disable submit buttons). |
| `zReset()` | - | `void` | Resets all validation state. |

### Error Handling

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `zIsValid(field)` | `string` | `boolean` | Checks if field is valid (after validation). |
| `zIsInvalid(field)` | `string` | `boolean` | Checks if field has validation errors. |
| `zFirstErrorFor(field)` | `string` | `string\|null` | Returns first error message for field. |
| `zGetErrorsFor(field)` | `string` | `string[]` | Returns all error messages for field. |
| `zAllErrors()` | - | `Object` | Returns all validation errors. |
| `zHasErrors()` | - | `boolean` | Checks if form has any errors. |
| `zAllSuccesses()` | - | `Object` | Returns validation success state for all fields. |

## 🔥 Advanced Features

### Event-Based Validation

Validate fields on specific events:

```html
<form
    x-zvalidation.listen="change"
    x-data="{ /* ... */ }"
>
    <!-- Validates on change event -->
</form>
```

### Reactive Validation

Enable real-time validation after first error:

```html
<form
    x-zvalidation.listen.reactive="change"
    x-data="{ /* ... */ }"
>
    <!-- Switches to input event validation after first error -->
</form>
```

### Livewire Integration

Sync validation with Livewire components:

```html
<form
    x-zvalidation.entangled
    x-data="{ 
        name: @entangle('clientData.name'),
        zSchema: $z.object({ 
            name: $z.string().min(3)
        })
    }"
>
    <!-- Syncs with Livewire validation -->
</form>
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

MIT Licensed. Enjoy building awesome forms!


