import {z, ZodType, ZodObject} from 'zod';
import {merge} from 'lodash';

const zValidate = function (Alpine) {

    Alpine.magic('z', () => z);

    Alpine.magic('zvalidation', (el) => {
        const {zValidateSchema: zSchema} = Alpine.$data(el);
        const formState = upsertFormState(el, {errors: {}, successes: []});

        return {
            isValid(field) {
                return formState.successes.includes(field);
            },
            isInvalid(field) {
                return Object.keys(formState.errors).includes(field);
            },
            getError(field) {
                return formState.errors[field] ?? null;
            },
            reset() {
                formState.errors = {};
                formState.successes = [];
            },
            validate() {
                const result = zSchema.safeParse(getData(el, true));
                this.reset();

                if (result.success) {
                    formState.successes = Object.keys(getData(el, true));
                    return true;
                }

                formState.errors = parseErrors(result.error);
                return false;
            },
            validateOnly(field) {
                if (!zSchema.shape || !(field in zSchema.shape)) {
                    console.warn(`No validation schema defined for the field: ${field}`);
                    return false;
                }

                const fieldData = {[field]: getData(el, true)[field]};
                const fieldSchema = zSchema.shape[field];

                const result = fieldSchema.safeParse(fieldData[field]);

                if (result.success) {
                    delete formState.errors[field];
                    if (!formState.successes.includes(field)) {
                        formState.successes.push(field);
                    }
                    return true;
                }

                formState.successes = formState.successes.filter(v => v !== field);
                formState.errors[field] = result.error.format()._errors[0] ?? '';
                return false;
            }
        };

    })

    const getElId = (el) => Alpine.$data(el).$id();

    const getFormState = (el) => window.zValidate[getElId(el)] ?? Alpine.reactive({errors: {}, successes: []});

    const upsertFormState = (el, value) => {
        window.zValidate = window.zValidate ?? {};
        window.zValidate[getElId(el)] = merge(getFormState(el), value);
        return window.zValidate[getElId(el)];
    }

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

    Alpine.directive('zvalidate', (el, {expression}, {effect, cleanup}) => {
        effect(() => {
            const data = getData(el);
            checkCompatibility(data);

            if (expression) {
                const handler = (event) => {
                    const model = event.target.getAttribute('x-model');
                    if (model) {
                        Alpine.$data(el).$zvalidation.validateOnly(model);
                    }
                };

                el.addEventListener(expression, handler);
                cleanup(() => el.removeEventListener(expression, handler));
            }
        })
    })
}

export {zValidate}