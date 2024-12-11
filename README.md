# Alpine.js Zod Validation

Is an integration between [Alpine.js](https://www.npmjs.com/package/alpinejs) and [Zod](https://www.npmjs.com/package/zod) for form validation.
This library allows you to define validation schemas using Zod and apply them directly in your Alpine.js components with ease.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

#### As a npm module + bundler

Install the package via npm:

```bash
$ npm i @mfgomess/alpine-zod-validation
```

Import the package in your project and start using it:

```javascript
import Alpine from 'alpinejs';
import {zValidation} from 'alpine-zod-validation';

window.Alpine = Alpine;
Alpine.plugin(zValidation);
Alpine.start();
```

#### Use it from CDN

```html

<script type="module" defer src="https://unpkg.com/@mfgomess/alpine-zod-validation/dist/cdn.js"/>
<script src="//unpkg.com/alpinejs" defer></script>
```

## Usage

To use validation you should apply the 'x-zvalidation' directive
to your alpinejs component, and define a 'zSchema' property with your Zod schema,
then you can use the validation methods provided by this plugin.

### Directives
- x-zvalidation: Directive to apply validation to the component.
- .listen: Modifier to listen to a specific event in child elements.
- .reactive: To validate on input event after the first validation error occurred.
- .entangled: To sync livewire validation errors with entangled properties of the component.

### Magic Properties
- $z: Magic method of Zod object instance.

```html

<form
    @submit.prevent="save"
    x-zvalidation.entangled.reactive.listen="change"
    x-data="{
        name: @entangle('clientData.name'), // Livewire entangled property
        zSchema: $z.object({ 
            name: $z.string().min(3), 
            email: $z.string().email() 
        }),
        save() {
            if(this.zValidate()) {
                console.log('Form is valid');
            }
        }
    }"
>
    <input
        type="text"
        x-model="name"
        x-bind:class="{ 
            'errored': zIsInvalid('name'), 
            'success': zIsValid('name') 
        }"
    />
    <span x-show="zIsInvalid('name')" x-text="zFirstErrorFor('name')"></span>
    <button type="submit">Submit</button>
</form>
```

## Features

### On-event validation

You can add a .listen modifier and an event to the x-validation directive,
it will listen to this occurred in child html elements with x-model
directive and validate only this for field property.

```html

<form
    x-zvalidation.listen="input"
    x-data="{ name: '', zSchema: $z.object({ name: $z.string().min(3) }) }"
>
    <!-- The field name will be validated when the input event is triggered -->
    <input type="text" x-model="name"/>
</form>
```

### Reactive validation

Once you use a .listen modifier to validate on change or blur events, it will validate the field only
when you change the value, and it will keep the error status until the user trigger the change event again.
With .reactive modifier it will **modify the validation to input event after the first validation error occurred** in the field.

```html

<form
    x-zvalidation.listen.reactive="input"
    x-data="{ name: '', zSchema: $z.object({ name: $z.string().min(3) }) }"
>
    <!-- The field name will be validated when the input event is triggered -->
    <input type="text" x-model="name"/>
</form>
```

### Livewire entangled validation

Once you add a .entangled modifier to the x-validation directive,
it will sync the validation errors with the entangled properties of the component.

If Livewire return validation errors for entangled properties, they will be
synced with the x-zvalidation errors and the field will be marked as invalid.

**Note:** It will already map the errors to the entangled properties, so you don't need to keep the livewire and alpinejs properties with same keys.

```html

<form
    x-zvalidation.entangled.listen="input"
    x-data="{ 
        name: @entangle('name'),
        phone: @entangle('client.phone'), 
        zSchema: $z.object({ 
            name: $z.string().min(3),
            phone: $z.string().min(10)
        }) 
    }"
>
    <!-- The field name will be validated when the input event is triggered -->
    <input type="text" x-model="name"/>

    <!-- The field phone will be validated when the input event is triggered -->
    <input type="text" x-model="phone"/>

    <!-- Once you validate the form with Livewire "save" method, the errors will be synced with Alpine.js if exists -->
    <button
        x-bind:disabled="zHasErrors()"
        wire:click.prevent="save"
    >Submit
    </button>
</form>
```

### $z magic method

The $z magic method is just a shortcut to the Zod object, you can use it to define your validation schema in a more readable way.

[Check Zod documentation](https://www.npmjs.com/package/zod) for more information about Zod.

### x-zvalidation directive methods added to the component

Once you add the x-zvalidation directive to your component, it will add some methods to the component instance to help you with the validation.

| Method                  | Return Type       | Description                                                                                       |
|-------------------------|-------------------|---------------------------------------------------------------------------------------------------|
| zIsValid('field')       | boolean           | Checks if a specific field is valid, returns a boolean. (Triggered only after the field is dirty) |
| zIsInvalid('field')     | boolean           | Checks if a specific field is invalid, returns a boolean.                                         |
| zFirstErrorFor('field') | ?string           | Gets the error message of a specific field, returns a string.                                     |
| zGetErrorsFor('field')  | string[]          | Gets all error messages for a specific field, returns an array.                                   |
| zAllErrors()            | {field: string[]} | Gets all error messages, returns an object.                                                       |
| zHasErrors()            | boolean           | Checks if the form has any errors, returns a boolean.                                             |
| zAllSuccesses()         | {field: boolean}  | Checks if the form has any successes, returns an object.                                             |
| zValidate()             | boolean           | Checks if the form is valid or not, returns a boolean.                                            |
| zValidateOnly('field')  | boolean           | Checks if a specific field is valid or not, returns a boolean.                                    |
| zReset()                | void              | Resets the form validation state.                                                                 |

## Contributing

Contributions, issues, and feature requests are welcome.

## License

MIT


