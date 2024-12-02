import {z, ZodType, ZodObject} from 'zod';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.plugin(Alpine => {


    Alpine.magic('z', () => z);

    const getData = (el, parse = false) => {
        if(parse) {
            return JSON.parse(JSON.stringify(Alpine.$data(el)));
        }
        return Alpine.$data(el);
    }

    const checkCompatibility = (data) => {
        if (typeof data !== 'object') {
            throw new Error('ZValidate: x-data must be an object to use zvalidate directive')
        }

        if (typeof data.zValidateSchema === 'undefined') {
            throw new Error('ZValidate: Missing validationSchema property on x-data model')
        }

        if (
            !(data.zValidateSchema instanceof ZodType) ||
            !(data.zValidateSchema instanceof ZodObject)
        ) {
            throw new Error('ZValidate: ValidationSchema property must be an instance of zod object (use $z magic property to get a zod instance)')
        }
    }

    function getValidationMethods(el, effect) {

        const {zValidateSchema: zSchema} = Alpine.$data(el);

        const parseErrors = (zodError) => {
            const errors = {};
            const zErrorsList = zodError.format();

            Object.keys(zErrorsList).forEach(
                (field) => {
                    if (field === '_errors' || !Array.isArray(zErrorsList[field]['_errors'])) return;
                    errors[field] = zErrorsList[field]['_errors'][0];
                }
            )

            return errors;
        }

        return {
            errors: {},
            successes: [],
            isValid(field) {
                return this.successes.includes(field)
            },
            hasError(field) {
                return (this.errors[field] ?? null) !== null;
            },
            getError(field) {
                return this.errors[field] ?? null;
            },
            reset() {
                this.errors = {}
            },
            validate() {
                const result = zSchema.safeParse(getData(el, true));

                if (result.success) {
                    this.reset();
                    this.successes = Object.keys(getData(el, true));
                    return true;
                }

                this.errors = parseErrors(result.error)
                this.successes = [];
                return false;
            },
            validateOnly(field) {
                if (!zSchema.shape || !zSchema.shape[field]) {
                    console.warn(`No validation schema defined for the field: ${field}`);
                    return false;
                }

                const fieldData = {[field]: getData(el, true)[field]};
                const fieldSchema = zSchema.shape[field];

                const result = fieldSchema.safeParse(fieldData[field]);

                if (result.success) {
                    delete this.errors[field];
                    this.successes.push(field);
                    return true;
                }

                this.successes = this.successes.filter(v => v !== field);
                this.errors[field] = result.error.format()._errors[0] ?? '';
                return false;
            }
        }
    }


    Alpine.directive('zvalidate', (el, {expression}, {effect, cleanup}) => {


        const data = getData(el);
        checkCompatibility(data);

        if (!data.zvalidate) {
            data.zvalidate = getValidationMethods(el, effect)
        }

        if (expression) {
            const listener = el.addEventListener(expression, (e) => {
                if (e.target.getAttribute('x-model')) {
                    data.zvalidate.validateOnly(e.target.getAttribute('x-model'))
                }
            })

            cleanup(() => {
                listener.remove()
            })
        }
    });
});

Alpine.start();