# alpinejs-zod-validate

`alpinejs-zod-validate` is an integration between [Alpine.js](https://alpinejs.dev/) and [Zod](https://github.com/colinhacks/zod) for form validation. This library allows you to define validation schemas using Zod and apply them directly in your Alpine.js components with ease.

## Features

- **Schema-based validation:** Utilize Zod schemas to define and validate your form data.
- **Reactive feedback:** Provides real-time feedback to the user with error and success states.
- **Easy integration:** Seamlessly integrates with Alpine.js, keeping your JavaScript code minimal and declarative.

## Installation

### You can install the package via npm:

```bash
npm install alpinejs-zod-validate
```

```javascript

import Alpine from 'alpinejs';
import zValidate from 'alpinejs-zod-validate';

window.Alpine = Alpine;
Alpine.plugin(zValidate);
Alpine.start();

```

### Use it from CDN
```bash
<script type="module" defer src="https://unpkg.com/@mfgomess/alpine-zod-validation/dist/cdn.js" />
<script src="//unpkg.com/alpinejs" defer></script>
```

## Usage

To use `alpinejs-zod-validate`, include it in your project and integrate it with your Alpine.js components. Below is an example of how to set up a simple form validation scenario:

### Example

```html
<!doctype html>
<html lang="pt_BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AlpineJS Validation</title>
    <style>
        .errored {
            border: 1px solid red;
        }

        .success {
            border: 1px solid green;
        }
    </style>
</head>
<body>

<form
    style="display: flex; flex-direction: column; gap: 10px; width: 300px;"
    x-zvalidate="input"
    x-data="{
        zValidateSchema: $z.object({ name: $z.string().min(3), email: $z.string().email('Digite um e-mail válido') }),
        name: '',
        email: '',
        save() {
            $zvalidation.validate();
        }
    }"
    @submit.prevent="save"
>
    <input
        type="text"
        placeholder="nome"
        x-model="name"
        :class="{ errored: $zvalidation.isInvalid('name'), success: $zvalidation.isValid('name') }"
    />
    <span x-show="$zvalidation.isInvalid('name')" x-text="$zvalidation.getError('name')"></span>
    <span x-show="$zvalidation.isValid('name')" x-text="'successo'"></span>

    <input
        type="text"
        placeholder="email"
        x-model="email"
        :class="{ errored: $zvalidation.isInvalid('email'), success: $zvalidation.isValid('email') }"
    />
    <span x-show="$zvalidation.isInvalid('email')" x-text="$zvalidation.getError('email')"></span>
    <span x-show="$zvalidation.isValid('email')" x-text="'successo'"></span>

    <button type="submit">Submit</button>
</form>

<script type="module" src="/builds/cdn.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.6/dist/cdn.min.js"></script>
</body>
</html>
```

### How to Use

1. Define a zod object schema into your x-data using the magic method $z
2. Append z-validate directive to your component
2.2 The z-validate accepts a param that will be used to validate inputs on demand, can be: input, change, blur, keyup, keydown, etc
3. Use the $zvalidation magic method to display the validation feedback, it exposes the following methods:
3.1. $zvalidation.isValid(fieldName)
3.2. $zvalidation.isInvalid(fieldName) 
3.3. $zvalidation.getError(fieldName)

## Contributing

Contributions, issues, and feature requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

This README provides an overview of the functionality, installation, and usage examples to help users get started with your package.

