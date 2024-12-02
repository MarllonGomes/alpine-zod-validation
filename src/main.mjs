import { z, ZodType, ZodObject } from 'zod';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.plugin((Alpine) => {

    Alpine.magic('z', () => z);

    const getData = (el, parse = false) => {
        const data = Alpine.$data(el);
        return parse ? JSON.parse(JSON.stringify(data)) : data;
    };

    const checkCompatibility = (data) => {
        if (typeof data !== 'object') {
            throw new Error('ZValidate: x-data must be an object to use the zvalidate directive.');
        }

        if (!data.zValidateSchema) {
            throw new Error('ZValidate: zValidateSchema property is required on x-data model.');
        }

        if (!(data.zValidateSchema instanceof ZodType) || !(data.zValidateSchema instanceof ZodObject)) {
            throw new Error('ZValidate: zValidateSchema must be an instance of a Zod object.');
        }
    };

    const parseErrors = (zodError) => {
        return Object.entries(zodError.format()).reduce((errors, [field, value]) => {
            if (field !== '_errors' && Array.isArray(value['_errors'])) {
                errors[field] = value['_errors'][0];
            }
            return errors;
        }, {});
    };

    const getValidationMethods = (el) => {
        const { zValidateSchema: zSchema } = Alpine.$data(el);

        return {
            errors: {},
            successes: [],
            isValid(field) {
                return this.successes.includes(field);
            },
            hasError(field) {
                return field in this.errors;
            },
            getError(field) {
                return this.errors[field] ?? null;
            },
            reset() {
                this.errors = {};
                this.successes = [];
            },
            validate() {
                const result = zSchema.safeParse(getData(el, true));
                this.reset();

                if (result.success) {
                    this.successes = Object.keys(getData(el, true));
                    return true;
                }

                this.errors = parseErrors(result.error);
                return false;
            },
            validateOnly(field) {
                if (!zSchema.shape || !(field in zSchema.shape)) {
                    console.warn(`No validation schema defined for the field: ${field}`);
                    return false;
                }

                const fieldData = { [field]: getData(el, true)[field] };
                const fieldSchema = zSchema.shape[field];

                const result = fieldSchema.safeParse(fieldData[field]);

                if (result.success) {
                    delete this.errors[field];
                    if (!this.successes.includes(field)) {
                        this.successes.push(field);
                    }
                    return true;
                }

                this.successes = this.successes.filter(v => v !== field);
                this.errors[field] = result.error.format()._errors[0] ?? '';
                return false;
            }
        };
    };

    Alpine.directive('zvalidate', (el, { expression }, { cleanup }) => {
        const data = getData(el);
        checkCompatibility(data);

        if (!data.zvalidate) {
            data.zvalidate = getValidationMethods(el);
        }

        if (expression) {
            const handler = (event) => {
                const model = event.target.getAttribute('x-model');
                if (model) {
                    data.zvalidate.validateOnly(model);
                }
            };

            el.addEventListener(expression, handler);
            cleanup(() => el.removeEventListener(expression, handler));
        }
    });
});

Alpine.start();